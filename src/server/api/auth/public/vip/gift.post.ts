import type { IAuth, IDBConfig, IDBItem, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { server, role } = await readBody(event)
    if(!server) throw 'Vui lòng chọn máy chủ'
    if(!role) throw 'Vui lòng chọn nhân vật'

    const config = await DB.Config
    .findOne()
    .select('vip') 
    .populate({ path: 'vip.gift.item', select: 'item_id type' }) as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình trang'
    if(config.vip.gift.length == 0) throw 'Quà tặng mỗi ngày chưa được cấu hình, vui lòng thử lại sau'

    const user = await DB.User.findOne({ _id: auth._id }).select('vip') as IDBUser
    if(!user) throw 'Tài khoản không tồn tại'
    if(!user.vip.enable) throw 'Tài khoản của bạn chưa có đặc quyền VIP'
    if(!!user.vip.gift) throw 'Bạn đã nhận quà mỗi ngày rồi'

    // Format Gift
    const giftItem : Array<any> = []
    const giftCurrency : any = {}
    config.vip.gift.forEach(gift => {
      const item = gift.item as IDBItem

      if(item.type == 'game_item'){
        giftItem.push({ id: item.item_id, amount: gift.amount })
      }
      if(!!['coin', 'wheel'].includes(item.type)){
        giftCurrency[`currency.${item.type}`] = gift.amount
      }
    })

    // Send Gift
    if(giftItem.length > 0) await gameSendMail(event, {
      account: auth.username,
      server_id: server,
      role_id: role,
      title: 'Web VIP Gift Today',
      content: `Quà ưu đãi VIP mỗi ngày trên Web`,
      items: giftItem
    })
    if(Object.keys(giftCurrency).length) await DB.User.updateOne({ _id: auth._id },{ $inc: giftCurrency })

    // Save
    user.vip.gift = true
    await user.save()

    // Log
    await logUser(event, user._id, 'Nhận quà ưu đãi VIP mỗi ngày')

    !!IO && IO.to(auth._id.toString()).emit('auth-update')
    return resp(event, { message: 'Nhận thưởng thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})