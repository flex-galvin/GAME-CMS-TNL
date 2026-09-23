import type { IAuth, IDBGiftcode } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'giftcode.edit')

    const body = await readBody(event)
    const { _id, code, limit, needpay } = body
    if(!_id || !code) throw 'Dữ liệu đầu vào không hợp lệ'

    if(
      !!isNaN(parseInt(limit)) 
      || parseInt(limit) < 0
    ) throw 'Dữ liệu giới hạn không hợp lệ'
    if(
      !!isNaN(parseInt(needpay)) 
      || parseInt(needpay) < 0
    ) throw 'Dữ liệu tổng nạp không hợp lệ'

    const giftcode = await DB.Giftcode.findOne({ _id: _id }).select('code') as IDBGiftcode
    if(!giftcode) throw 'Mã không tồn tại'

    const upCode = code.toUpperCase()
    if(giftcode.code != upCode){
      const getByCode = await DB.Giftcode.findOne({ code: upCode }).select('_id') as IDBGiftcode
      if(!!getByCode) throw 'Tên mã đã tồn tại'
    }

    delete body['_id']
    body.code = upCode
    await DB.Giftcode.updateOne({ _id: _id }, body)

    await logAdmin(event, `Sửa thông tin Giftcode <b>${giftcode.code}</b>`)
    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})