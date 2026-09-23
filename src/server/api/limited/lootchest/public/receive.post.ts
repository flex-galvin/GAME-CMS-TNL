import type { IAuth, IDBItem, IDBLimitedLootChest } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { server, role } = await readBody(event)
    if(!server) throw 'Vui lòng chọn máy chủ'
    if(!role) throw 'Vui lòng chọn nhân vật'

    // Check Event
    let config = await DB.LimitedLootChest.findOne({})
    .select('time owner reward receive') 
    .populate({ path: 'reward.item', select: 'item_id type' })as IDBLimitedLootChest
    if(!config) throw 'Không tìm thấy cấu hình sự kiện'
    
    // Check Time
    if(!config.time.active) throw 'Sự kiện chưa khai mở'
    const now = dayjs(Date.now()).unix()
    const start = dayjs(config.time.start).unix()
    const end = dayjs(config.time.end).unix()
    const rewardTime = dayjs(config.time.end).add(1, 'day').unix()
    if(now < start || now > rewardTime) throw 'Sự kiện đã kết thúc'
    if(now < end) throw 'Chưa tới thời gian nhận thưởng'

    // Check Reward
    const reward = config.reward
    if(reward.length == 0) throw 'Rương chưa có quà, vui lòng quay lại sau'

    // Check Last Hit User
    if(!config.owner) throw 'Không tìm thấy người sở hữu rương'
    if(config.owner.toString() != auth._id.toString()) throw 'Bạn không phải người sở hữu rương'

    // Check History
    if(!!config.receive.status) throw 'Rương này đã được nhận'

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
      title: 'Web Limited Loot Chest',
      content: `Nhận thưởng cướp rương trên Web`,
      items: giftItem
    })
    if(Object.keys(giftCurrency).length) await DB.User.updateOne({ _id: auth._id },{ $inc: giftCurrency })
    

    // Save Log
    await DB.LimitedLootChest.updateMany({}, { 
      'time.active': false,
      'receive.status': true,
      'receive.server': server,
      'receive.role': role,
    })

    // Send Data
    return resp(event, { message: 'Nhận thưởng thành công' }) 
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})