import type { IDBLevel, IDBUser, IDBItem, IAuth, IDBLimitedShop } from "~~/types"

const currencyTypeList = ['coin', 'wheel']
const moneyType = ['coin', 'diamond']

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { pack, server, role, money : buyBy } = await readBody(event)
    if(!pack) throw 'Không tìm thấy ID vật phẩm'
    if(!server) throw 'Không tìm thấy ID máy chủ'
    if(!role) throw 'Không tìm thấy ID nhân vật'
    if(!moneyType.includes(buyBy)) throw 'Tiền tệ không hỗ trợ'

    // Check User
    const user = await DB.User.findOne({ _id: auth._id }).select('currency.coin currency.diamond level spend') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'
    const level = await DB.Level.findOne({ _id: user.level }).select('discount') as IDBLevel
    if(!level) throw 'Không tìm thấy thông tin cấp độ'

    // Shop Limited Data
    const shopLimited = await DB.LimitedShop
    .findOne({ _id: pack }) 
    .select('name gift price limit')
    .populate({ path: 'gift.item' }) as IDBLimitedShop
    if(!shopLimited) throw 'Gói không tồn tại'
    if(!shopLimited.gift || shopLimited.gift.length == 0) throw 'Gói hiện chưa có vật phẩm'

    // Check Limit Buy
    if(shopLimited.limit > 0){
      const countBuy = await DB.LimitedShopHistory.count({ pack: shopLimited._id })
      if(countBuy >= shopLimited.limit) throw `Gói này đã được bán hết`
    }

    // Check Has Buy
    const hasBuy = await DB.LimitedShopHistory.count({ user: user._id, pack: shopLimited._id })
    if(hasBuy > 0) throw 'Bạn đã mua gói này rồi'
    
    // Total Price
    const price = shopLimited.price
    const discount = 0
    const totalPrice = Math.floor(price - Math.floor(price * discount / 100))

    // @ts-expect-error
    if(totalPrice > user.currency[buyBy]) throw 'Số dư xu không đủ'

    // Format Gift
    const giftItem : Array<any> = []
    const giftCurrency : any = {}

    shopLimited.gift.forEach(gift => {
      const item = gift.item as IDBItem

      if(item.type == 'game_item'){
        giftItem.push({ id: item.item_id, amount: gift.amount })
      }
      if(!!currencyTypeList.includes(item.type)){
        giftCurrency[`currency.${item.type}`] = gift.amount
      }
    })

    // Send Gift
    if(giftItem.length > 0){
      await gameSendMail(event, {
        account: auth.username,
        server_id: server,
        role_id: role,
        title: 'Web Limited Shop',
        content: 'Gói hạn thời mua trên Web',
        items: giftItem
      })
    }
    if(Object.keys(giftCurrency).length){
      await DB.User.updateOne({ _id: auth._id },{ $inc: giftCurrency })
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
    await DB.LimitedShopHistory.create({
      user: auth._id,
      pack: shopLimited._id,
      server: server,
      role: role,
      price: totalPrice
    })
    await DB.LimitedShop.updateOne({ _id: shopLimited._id }, { $inc: { buyed: 1 }})

    await logUser(event, auth._id, `Dùng <b>${totalPrice.toLocaleString("vi-VN")} ${buyBy == 'coin' ? 'Xu' : 'Cống Hiến'}</b> để mua gói hạn thời <b>${shopLimited.name}</b> tại máy chủ <b>${server}</b> nhân vật <b>${role}</b>`)
    !!IO && IO.to(auth._id.toString()).emit('auth-update')

    return resp(event, { message: 'Mua gói thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})