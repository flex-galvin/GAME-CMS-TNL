import { Types } from "mongoose"
import type { IAuth, IDBItem, IDBLimitedPay, IDBLimitedPayHistory, IDBLimitedPayUser, } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { server, role, money } = await readBody(event)
    if(!server) throw 'Vui lòng chọn máy chủ'
    if(!role) throw 'Vui lòng chọn nhân vật'
    if(!money) throw 'Vui lòng chọn mốc nhận thưởng'

    // Check Event
    let config = await DB.LimitedPay.findOne({})
    .select('time reward') 
    .populate({ path: 'reward.gift.item', select: 'item_id type' })as IDBLimitedPay
    if(!config) throw 'Không tìm thấy cấu hình sự kiện'
    if(!config.time.active) throw 'Sự kiện chưa khai mở'

    // Check Reward
    if(config.reward.length == 0) throw 'Sự kiện chưa cấu hình phần thưởng, vui lòng quay lại sau'
    const reward = config.reward.find((item : any) => item.step == money)
    if(!reward) throw 'Mốc nhận thưởng không tồn tại'
    if(reward.gift.length == 0) throw 'Mốc nhận chưa cấu hình phần thưởng, vui lòng quay lại sau'

    // Check Time
    const now = dayjs(Date.now()).unix()
    const start = dayjs(config.time.start).unix()
    const end = dayjs(config.time.end).unix()
    if(now < start || now > end) throw 'Sự kiện đã kết thúc'

    // Check User Event
    const userEvent = await DB.LimitedPayUser.findOne({ user: auth._id }).select('money') as IDBLimitedPayUser
    if(!userEvent) throw 'Bạn không có trong danh sách tham gia sự kiện'

    // Check History
    const history = await DB.LimitedPayHistory.findOne({ user: auth._id, money: money }).select('_id') as IDBLimitedPayHistory
    if(!!history) throw 'Bạn đã nhận phần thưởng này rồi'

    // Check Money
    if(userEvent.money < money) throw 'Bạn chưa đạt điều kiện nhận thưởng'

    // Get Gift
    const gifts = reward.gift
    const giftItem : Array<any> = []
    const giftCurrency : any = {}
    gifts.forEach(gift => {
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
      title: 'Web Limited Payment',
      content: `Nhận thưởng mốc nạp ${money} VNĐ sự kiện Nạp Tích Lũy trên Web`,
      items: giftItem
    })
    if(Object.keys(giftCurrency).length) await DB.User.updateOne({ _id: auth._id },{ $inc: giftCurrency })
    
    // Save Log
    await DB.LimitedPayHistory.create({
      user: auth._id,
      server: server,
      role: role,
      money: money
    })

    // Send Data
    return resp(event, { message: 'Nhận thưởng thành công' }) 
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})