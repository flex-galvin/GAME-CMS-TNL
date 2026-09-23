import type { IAuth, IDBGiftcode } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'giftcode.edit')

    const body = await readBody(event)
    const { _id, gift } = body
    if(!_id || !gift) throw 'Dữ liệu đầu vào không hợp lệ'

    const giftcode = await DB.Giftcode.findOne({ _id: _id }).select('code gift') as IDBGiftcode
    if(!giftcode) throw 'Mã không tồn tại'

    const giftFormat = gift.map((i : any) => ({ item: i.item._id, amount: i.amount }))

    await DB.Giftcode.updateOne({ _id: _id }, { gift: giftFormat })

    await logAdmin(event, `Sửa phần thưởng Giftcode <b>${giftcode.code}</b>`)
    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})