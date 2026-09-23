import type { IAuth, IDBGiftcode } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'giftcode.add')

    const body = await readBody(event)
    const { code, limit, needpay } = body
    if(!code) throw 'Dữ liệu đầu vào không hợp lệ'

    if(
      !!isNaN(parseInt(limit)) 
      || parseInt(limit) < 0
    ) throw 'Dữ liệu giới hạn không hợp lệ'
    if(
      !!isNaN(parseInt(needpay)) 
      || parseInt(needpay) < 0
    ) throw 'Dữ liệu tổng nạp không hợp lệ'

    const upCode = code.toUpperCase()
    const getByCode = await DB.Giftcode.findOne({ code: upCode }).select('_id') as IDBGiftcode
    if(!!getByCode) throw 'Tên mã đã tồn tại'

    body.code = upCode
    await DB.Giftcode.create(body)

    await logAdmin(event, `Thêm mã Giftcode <b>${upCode}</b>`)
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})