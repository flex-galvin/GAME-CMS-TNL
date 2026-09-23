import type { IAuth, IDBAdminIP } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'IP.whitelist.del')

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const ipCheck = await DB.AdminIP.findOne({ _id: _id }) as IDBAdminIP
    if(!ipCheck) throw 'IP đã tồn tại'

    await DB.AdminIP.deleteOne({ _id: _id })
    await logAdmin(event, `Xóa IP <b>${ipCheck.ip}</b> khoir White List`)

    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})