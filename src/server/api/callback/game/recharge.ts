import type { IDBShop, IDBItem, IDBShopConfig, IDBLevel, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { account, role, item_id, item_name, description, price, server } = await readBody(event)
    if(!account) throw 'Không tìm thấy tên tài khoản'
    if(!item_id) throw 'Không tìm thấy ID vật phẩm'
    if(!server) throw 'Không tìm thấy thông tin máy chủ'
    if(!role) throw 'Không tìm thấy thông tin nhân vật'

    // Check User
    const user = await DB.User.findOne({ username: account }).select('currency.coin currency.diamond level spend') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'
    const level = await DB.Level.findOne({ _id: user.level }).select('discount') as IDBLevel
    if(!level) throw 'Không tìm thấy thông tin cấp độ'

    // Check Item And Create
    let item = await DB.Item.findOne({ item_id: item_id, type: 'game_recharge' }).select('item_name item_image type') as IDBItem
    if(!item){
      if(!item_name || !price) throw 'Vật phẩm không hỗ trợ'
      if(!!isNaN(parseInt(price)) || parseInt(price) < 1) throw 'Số tiền không hợp lệ'
      if(user.type < 1 && user.currency.coin < parseInt(price)) throw 'Số dư xu không đủ'

      item = await DB.Item.create({
        item_id: item_id,
        item_name: item_name,
        key: formatVNString(item_name, '-'),
        type: 'game_recharge'
      }) as IDBItem

      await DB.Shop.create({ 
        item: item._id,
        description: description,
        price: price
      })
    }

    // Shop Config
    const shopConfig = await DB.ShopConfig.findOne() as IDBShopConfig
    if(!shopConfig) throw 'Không tìm thấy cấu hình cửa hàng'
    if(!!shopConfig.maintenance) throw 'Cửa hàng đang bảo trì, vui lòng quay lại sau'

    // Shop Item Data
    const shopData = await DB.Shop
    .findOne({ item: item._id }) 
    .select('item item_amount price')
    .populate({ path: 'item', select: 'item_id item_name type' }) as IDBShop
    if(!shopData) throw 'Vật phẩm không tồn tại'

    // Total Price
    const priceBuy = shopData.price
    const discountLevel = level.discount
    const discountSystem = getShopDiscount(event, shopConfig)
    const discount = discountLevel + discountSystem > 100 ? 100 : discountLevel + discountSystem
    const totalPrice = Math.floor(priceBuy - Math.floor(priceBuy * discount / 100))
    if(totalPrice > user.currency.coin) throw 'Số dư không đủ'

    // Send Item
    const itemData = shopData.item as IDBItem
    await gameSendRecharge(event, {
      account: account,
      server_id: server.toString(),
      role_id: role.toString(),
      recharge_id: itemData.item_id,
      save_pay: shopData.price
    })

    // Update User
    await DB.User.updateOne({ _id: user._id },{
      $inc: {
        'currency.coin': totalPrice * -1,
        'spend.total.coin': totalPrice,
        'spend.day.coin': totalPrice,
        'spend.month.coin': totalPrice
      }
    })

    // History
    await DB.ShopHistory.create({
      user: user._id,
      item: itemData._id,
      server: server,
      role: role,
      price: totalPrice,
      amount: 1
    })

    await logUser(event, user._id, `Dùng <b>${totalPrice.toLocaleString("vi-VN")} Xu</b> để mua <b>x1 ${itemData.item_name}</b> tại máy chủ <b>${server}</b> nhân vật <b>${role}</b>`)
    return resp(event, { message: 'Mua vật phẩm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})