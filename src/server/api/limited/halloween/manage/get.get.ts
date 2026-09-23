import type { IAuth, IDBLimitedHalloween } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'
    
    let config = await DB.LimitedHalloween.findOne().select('_id') as IDBLimitedHalloween
    if(!config) config = await DB.LimitedHalloween.create({ time: { active: false }})
    
    const eventData = await DB.LimitedHalloween
    .findOne({ _id: config._id })
    .populate({ path: 'jar.reward.item', select: 'item_id item_name item_image type' })
    .populate({ path: 'pumpkin.reward.item', select: 'item_id item_name item_image type' })
    .populate({ path: 'top.reward.gift.item', select: 'item_id item_name item_image type' })
    if(!eventData) throw 'Không tìm thấy cấu hình'

    return resp(event, { result: eventData })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})