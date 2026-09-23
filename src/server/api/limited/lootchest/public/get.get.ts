import type { IDBLimitedLootChest } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    let config = await DB.LimitedLootChest
    .findOne({})
    .populate({ path: 'owner', select: 'username' })
    .populate({ path: 'reward.item', select: 'item_id item_name item_image type' }) as IDBLimitedLootChest
    if(!config) throw 'Không tìm thấy cấu hình sự kiện Cướp Rương'
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