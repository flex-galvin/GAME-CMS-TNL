import type { IDBLimitedPay } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    let config = await DB.LimitedPay
    .findOne({})
    .populate({ path: 'reward.gift.item', select: 'item_id item_name item_image type' }) as IDBLimitedPay
    if(!config) throw 'Không tìm thấy cấu hình sự kiện'
    if(!config.time.active) throw 'Sự kiện chưa khai mở'
    if(!config.time.start || !config.time.end) throw 'Sự kiện chưa khai mở' 

    const now = dayjs(Date.now()).unix()
    const start = dayjs(config.time.start).unix()
    const end = dayjs(config.time.end).unix()

    const result = JSON.parse(JSON.stringify(config))
    if(now < start || now > end) throw 'Sự kiện đã kết thúc'

    return resp(event, { result: result })
  } 
  catch (e:any) {
    return resp(event, { result: null })
  }
})