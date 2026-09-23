import type { IAuth, IDBEgg } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'
    
    const config = await DB.Egg
    .findOne()
    .populate({ path: 'one.gift.item', select: 'item_id item_name item_image type' })
    .populate({ path: 'two.gift.item', select: 'item_id item_name item_image type' })
    .populate({ path: 'three.gift.item', select: 'item_id item_name item_image type' })
    .populate({ path: 'four.gift.item', select: 'item_id item_name item_image type' })
    .populate({ path: 'five.gift.item', select: 'item_id item_name item_image type' })
    .populate({ path: 'six.gift.item', select: 'item_id item_name item_image type' }) as IDBEgg
    if(!config) throw 'Không tìm thấy cấu hình xúc xắc'

    return resp(event, { result: config })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})