import type { IDBItem, IDBGiftcode, IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { code, server_id } = await readBody(event)
    if(!code) throw 'Không tìm thấy mã Giftcode'

    // Giftcode
    const giftcodeData = await DB.Giftcode
    .findOne({ code: code.toUpperCase(), display: 1 })
    .populate({
      path: 'gift.item',
      select: 'item_name item_image type'
    })
    .select('-createdAt -updateAt -display') as IDBGiftcode

    // Check Giftcode
    if(!giftcodeData) throw 'Mã không tồn tại'
    if(giftcodeData.gift.length == 0) throw 'Mã chưa có phần thưởng để nhận'

    // Result
    const result = {
      giftcode: giftcodeData,
      server: server_id
    }

    return resp(event, { result: result })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})