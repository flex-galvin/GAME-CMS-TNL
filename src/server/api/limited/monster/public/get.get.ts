import type { IAuth, IDBLimitedMonster } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    let config = await DB.LimitedMonster
    .findOne({})
    .populate({ path: 'blood.reward.gift.item', select: 'item_id item_name item_image type' })
    .populate({ path: 'lasthit.user', select: 'username' })
    .populate({ path: 'lasthit.reward.item', select: 'item_id item_name item_image type' })
    .populate({ path: 'top.reward.gift.item', select: 'item_id item_name item_image type' }) as IDBLimitedMonster
    if(!config) throw 'Không tìm thấy cấu hình sự kiện'
    if(!config.time.active) throw 'Sự kiện chưa khai mở'
    if(!config.time.start || !config.time.end) throw 'Sự kiện chưa khai mở' 
    
    const now = dayjs(Date.now()).unix()
    const start = dayjs(config.time.start).unix()
    const end = dayjs(config.time.end).unix()
    const reward = dayjs(config.time.end).add(1, 'day').unix()

    const result = JSON.parse(JSON.stringify(config))
    if(now < start || now > reward) throw 'Sự kiện đã kết thúc'
    if(now >= end && now < reward) result.rewardTime = dayjs(config.time.end).add(1, 'day').toDate()
    return resp(event, { result: result })
  } 
  catch (e:any) {
    return resp(event, { result: null })
  }
})