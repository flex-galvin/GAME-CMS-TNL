import type { IAuth, IDBGiftcodeHistory } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'giftcode.delHistory')

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const history = await DB.GiftcodeHistory.findOne({ _id: _id }) as IDBGiftcodeHistory
    if(!history) throw 'Dữ liệu lịch sử không tồn tại'

    await DB.GiftcodeHistory.deleteOne({ _id: _id })
    return resp(event, { message: 'Xóa hành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})