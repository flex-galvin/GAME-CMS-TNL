import type { IDBLevel, IDBUser, IDBShopPack, IDBItem, IAuth, IDBShopConfig, IDBConfig } from "~~/types"

const currencyTypeList = [
  'coin', 'wheel'
]

const moneyType = ['coin', 'diamond']

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { pack, server, role, money : buyBy, amount } = await readBody(event)
    if(!pack) throw 'Không tìm thấy ID vật phẩm'
    if(!server) throw 'Không tìm thấy ID máy chủ'
    if(!role) throw 'Không tìm thấy ID nhân vật'
    if(!!isNaN(parseInt(amount)) || parseInt(amount) < 1) throw 'Số lượng không hợp lệ'
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

    // Shop Pack Data
    const shopPack = await DB.ShopPack
    .findOne({ _id: pack }) 
    .select('name gift price limit servers')
    .populate({ path: 'gift.item' }) as IDBShopPack
    if(!shopPack) throw 'Gói không tồn tại'
    if(!shopPack.gift || shopPack.gift.length == 0) throw 'Gói hiện chưa có vật phẩm'

    // Check Servers
    const servers = shopPack.servers
    if(!!servers && servers.length > 0){
      const hasServer = servers.findLastIndex(i => i == server)
      if(hasServer == -1) throw 'Gói mua không áp dụng cho máy chủ này'
    }
    
    // Total Price
    const price = shopPack.price * parseInt(amount)
    const discountLevel = level.discount
    const discountSystem = getShopDiscount(event, shopConfig)
    const discountVip = getVipDiscount(webConfig, user)
    const discount = (discountLevel + discountSystem + discountVip) > 100 ? 100 : discountLevel + discountSystem + discountVip
    const totalPrice = Math.floor(price - Math.floor(price * discount / 100))

    // @ts-expect-error
    if(totalPrice > user.currency[buyBy]) throw 'Số dư xu không đủ'

    // Check Limit Buy
    if(shopPack.limit > 0){
      if(amount > shopPack.limit) throw `Không thể nhập quá ${shopPack.limit} gói`

      const now = dayjs()
      const start = now.startOf('day').toDate()
      const end = now.endOf('day').toDate()
      const matchTime = { $gte: start, $lte: end }

      const historyDay = await DB.ShopPackHistory.count({
        user: user._id,
        pack: shopPack._id,
        server: server,
        role: role,
        createdAt: matchTime
      })

      if(historyDay >= shopPack.limit) throw `Hôm nay bạn đã đạt giới hạn mua gói này cho nhân vật của máy chủ này`
    }

    // Format Gift
    const giftItem : Array<any> = []
    const giftCurrency : any = {}

    shopPack.gift.forEach(gift => {
      const item = gift.item as IDBItem

      if(item.type == 'game_item'){
        giftItem.push({ id: item.item_id, amount: gift.amount * parseInt(amount) })
      }
      if(!!currencyTypeList.includes(item.type)){
        giftCurrency[`currency.${item.type}`] = gift.amount * parseInt(amount)
      }
    })

    // Send Gift
    if(giftItem.length > 0){
      await gameSendMail(event, {
        account: auth.username,
        server_id: server,
        role_id: role,
        title: 'Web Shop',
        content: 'Gói mua từ cửa hàng trên Web',
        items: giftItem
      })
    }
      
    if(Object.keys(giftCurrency).length){
      await DB.User.updateOne({ _id: auth._id },{
        $inc: giftCurrency
      })
    }

    // Update User
    await DB.User.updateOne({ _id: auth._id },{
      $inc: {
        [`currency.${buyBy}`]: totalPrice * -1,
        'spend.total.coin': totalPrice,
        'spend.day.coin': totalPrice,
        'spend.month.coin': totalPrice,
      }
    })

    // History
    await Promise.allSettled([
      DB.ShopPackHistory.create({
        user: auth._id,
        pack: shopPack._id,
        server: server,
        role: role,
        price: totalPrice,
        amount: parseInt(amount)
      }),

      logUser(event, auth._id, `Dùng <b>${totalPrice.toLocaleString("vi-VN")} ${buyBy == 'coin' ? 'Xu' : 'Cống Hiến'}</b> để mua gói <b>x${amount} ${shopPack.name}</b> tại máy chủ <b>${server}</b> nhân vật <b>${role}</b>`)
    ])

    !!IO && IO.to(auth._id.toString()).emit('auth-update')
    return resp(event, { message: 'Mua gói thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})