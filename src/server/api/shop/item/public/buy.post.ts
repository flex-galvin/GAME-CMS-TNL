import type { IDBLevel, IDBUser, IDBShop, IDBItem, IAuth, IDBShopConfig, IDBConfig } from "~~/types"

const moneyType = ['coin', 'diamond']

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { item, server, role, amount, money : buyBy } = await readBody(event)
    if(!item) throw 'Không tìm thấy ID vật phẩm'
    if(!server) throw 'Không tìm thấy ID máy chủ'
    if(!role) throw 'Không tìm thấy ID nhân vật'
    if(!!isNaN(parseInt(amount)) || parseInt(amount) < 1) throw 'Số lượng không hợp lệ'
    if(amount > 1000) throw 'Số lượng không vượt quá 1000'
    if(!moneyType.includes(buyBy)) throw 'Tiền tệ không hỗ trợ'

    // Web Config
    const webConfig = await DB.Config.findOne().select('vip enable') as IDBConfig
    if(!webConfig) throw 'Không tìm thấy cấu hình trang'
    if(!webConfig.enable.play) throw 'Trò chơi đang bảo trì, vui lòng quay lại sau'

    // Shop Config
    const shopConfig = await DB.ShopConfig.findOne() as IDBShopConfig
    if(!shopConfig) throw 'Không tìm thấy cấu hình cửa hàng'
    if(!!shopConfig.maintenance) throw 'Cửa hàng đang bảo trì, vui lòng quay lại sau'

    // Check User
    const user = await DB.User.findOne({ _id: auth._id }).select('currency level vip spend') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'
    const level = await DB.Level.findOne({ _id: user.level }).select('discount') as IDBLevel
    if(!level) throw 'Không tìm thấy thông tin cấp độ'

    // Shop Item Data
    const shopData = await DB.Shop
    .findOne({ _id: item }) 
    .select('item item_amount price servers limit')
    .populate({ path: 'item', select: 'item_id item_name type' }) as IDBShop
    if(!shopData) throw 'Vật phẩm không tồn tại'

    // Check Servers
    const servers = shopData.servers
    if(!!servers && servers.length > 0){
      const hasServer = servers.findLastIndex(i => i == server)
      if(hasServer == -1) throw 'Vật phẩm không áp dụng cho máy chủ này'
    }

    // Total Price
    const price = shopData.price * parseInt(amount)
    const discountLevel = level.discount
    const discountSystem = getShopDiscount(event, shopConfig)
    const discountVip = getVipDiscount(webConfig, user)
    const discount = (discountLevel + discountSystem + discountVip) > 100 ? 100 : discountLevel + discountSystem + discountVip
    const totalPrice = Math.floor(price - Math.floor(price * discount / 100))

    // @ts-expect-error
    if(totalPrice > user.currency[buyBy]) throw 'Số dư không đủ'

    // Item Data
    const itemData = shopData.item as IDBItem
    const itemType = itemData.type

    // Check Limit Buy
    if(shopData.limit > 0){
      const countBuy = await DB.ShopHistory.count({ user: auth._id, item: itemData._id, server: server, role: role })
      if(countBuy >= shopData.limit) throw `Bạn đã đạt giới hạn mua vật phẩm này cho nhân vật của máy chủ này`
    }

    // Send Item To Game
    if(itemType == 'game_recharge'){
      await gameSendRecharge(event, {
        account: auth.username,
        server_id: server,
        role_id: role,
        recharge_id: itemData.item_id,
        save_pay: shopData.price
      })
    }
    if(itemType == 'game_item'){
      await gameSendMail(event, {
        account: auth.username,
        server_id: server,
        role_id: role,
        title: 'Web Shop',
        content: 'Vật phẩm mua từ Web Shop',
        items: [{ id: itemData.item_id, amount: parseInt(amount) * (shopData.item_amount || 1) }]
      })
    }

    // Update User
    await DB.User.updateOne({ _id: auth._id },{
      $inc: {
        [`currency.${buyBy}`]: totalPrice * -1,
        'spend.total.coin': totalPrice,
        'spend.day.coin': totalPrice,
        'spend.month.coin': totalPrice
      }
    })

    // History
    await Promise.allSettled([
      DB.ShopHistory.create({
        user: auth._id,
        item: itemData._id,
        server: server,
        role: role,
        price: totalPrice,
        amount: parseInt(amount)
      }),

      logUser(event, auth._id, `Dùng <b>${totalPrice.toLocaleString("vi-VN")} ${buyBy == 'coin' ? 'Xu' : 'Cống Hiến'}</b> để mua <b>x${amount} ${itemData.item_name}</b> tại máy chủ <b>${server}</b> nhân vật <b>${role}</b>`)
    ])

    !!IO && IO.to(auth._id.toString()).emit('auth-update')
    return resp(event, { message: 'Mua vật phẩm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})