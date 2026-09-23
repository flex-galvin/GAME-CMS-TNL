import type { IAuth, IDBAdminIP } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'IP.whitelist.edit')

    const body = await readBody(event)
    const { _id, ip } = body
    if(!_id || !ip) throw 'Dữ liệu đầu vào không hợp lệ'

    const ipCheck = await DB.AdminIP.findOne({ _id: _id }) as IDBAdminIP
    if(!ipCheck) throw 'IP đã tồn tại'

    delete body['_id']
    await DB.AdminIP.updateOne({ _id: _id }, body)
    await logAdmin(event, `Sửa thông tin IP <b>${ipCheck.ip}</b> trong White List`)

    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})