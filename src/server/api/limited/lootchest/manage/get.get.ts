import type { IAuth, IDBLimitedLootChest } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'
    
    let config = await DB.LimitedLootChest.findOne().select('_id') as IDBLimitedLootChest
    if(!config) config = await DB.LimitedLootChest.create({ time: { active: false }})
    
    const eventData = await DB.LimitedLootChest
    .findOne({ _id: config._id })
    .populate({ path: 'owner', select: 'username' })
    .populate({ path: 'reward.item', select: 'item_id item_name item_image type' })
    if(!eventData) throw 'Không tìm thấy cấu hình'

    return resp(event, { result: eventData })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})