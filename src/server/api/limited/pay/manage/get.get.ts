import type { IAuth, IDBLimitedPay } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'
    
    let config = await DB.LimitedPay.findOne().select('_id') as IDBLimitedPay
    if(!config) config = await DB.LimitedPay.create({ time: { active: false }})
    
    const eventData = await DB.LimitedPay
    .findOne({ _id: config._id })
    .populate({ path: 'reward.gift.item', select: 'item_id item_name item_image type' }) as IDBLimitedPay
    if(!eventData) throw 'Không tìm thấy cấu hình'

    return resp(event, { result: eventData })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})