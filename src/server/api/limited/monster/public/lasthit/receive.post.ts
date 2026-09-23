import type { IAuth, IDBItem, IDBLimitedMonster } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { server, role } = await readBody(event)
    if(!server) throw 'Vui lòng chọn máy chủ'
    if(!role) throw 'Vui lòng chọn nhân vật'

    // Check Event
    let config = await DB.LimitedMonster.findOne({})
    .select('time lasthit') 
    .populate({ path: 'lasthit.reward.item', select: 'item_id type' })as IDBLimitedMonster
    if(!config) throw 'Không tìm thấy cấu hình sự kiện'
    
    // Check Time
    if(!config.time.active) throw 'Sự kiện chưa khai mở'
    const now = dayjs(Date.now()).unix()
    const start = dayjs(config.time.start).unix()
    const rewardTime = dayjs(config.time.end).add(1, 'day').unix()
    if(now < start || now > rewardTime) throw 'Sự kiện đã kết thúc'

    // Check Reward
    const reward = config.lasthit.reward
    if(reward.length == 0) throw 'Sự kiện chưa có quà, vui lòng quay lại sau'

    // Check Last Hit User
    if(!config.lasthit.user) throw 'Không tìm thấy người kết liễu'
    if(config.lasthit.user.toString() != auth._id.toString()) throw 'Bạn không phải người kết liễu'
    
    // Check History
    if(!!config.lasthit.receive.status) throw 'Phần thưởng kết liễu đã được nhận'

    // Format Gift
    const giftItem : Array<any> = []
    const giftCurrency : any = {}
    reward.forEach(gift => {
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
      title: 'Web Limited Monster',
      content: `Nhận thưởng kết liễu tiêu diệt quái vật trên Web`,
      items: giftItem
    })
    if(Object.keys(giftCurrency).length) await DB.User.updateOne({ _id: auth._id },{ $inc: giftCurrency })
    

    // Save Log
    await DB.LimitedMonster.updateMany({}, { 
      'lasthit.receive.status': true,
      'lasthit.receive.server': server,
      'lasthit.receive.role': role,
    })

    // Send Data
    return resp(event, { message: 'Nhận thưởng thành công' }) 
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})