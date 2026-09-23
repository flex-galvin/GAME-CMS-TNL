import type { IAuth, IDBGiftcode, IDBItem } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { code } = await readBody(event)
    if(!code) throw 'Không tìm thấy tên mã'

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
    
    // Check Limit
    if(giftcodeData.limit > 0){
      const countReceive = await DB.GiftcodeHistory.count({ giftcode: giftcodeData._id })
      if(countReceive >= giftcodeData.limit) throw 'Mã này đã hết lượt sử dụng'
    }

    return resp(event, { result: giftcodeData })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})