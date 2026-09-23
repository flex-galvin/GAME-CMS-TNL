import type { IAuth, IDBLimitedLunar } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'
    
    let config = await DB.LimitedLunar.findOne().select('_id') as IDBLimitedLunar
    if(!config) config = await DB.LimitedLunar.create({ time: { active: false }})
    
    const eventData = await DB.LimitedLunar
    .findOne({ _id: config._id })
    .populate({ path: 'jar.reward.gift.item', select: 'item_id item_name item_image type' })
    .populate({ path: 'eve.gift.item', select: 'item_id item_name item_image type' })
    .populate({ path: 'redbag.reward.gift.item', select: 'item_id item_name item_image type' })
    .populate({ path: 'redbag.random.item', select: 'item_id item_name item_image type' })
    .populate({ path: 'top.reward.gift.item', select: 'item_id item_name item_image type' })
    .populate({ path: 'piece.reward.gift.item', select: 'item_id item_name item_image type' })
    if(!eventData) throw 'Không tìm thấy cấu hình'

    return resp(event, { result: eventData })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})