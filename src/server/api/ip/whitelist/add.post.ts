import type { IAuth, IDBAdminIP } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'IP.whitelist.add')

    const body = await readBody(event)
    const { ip } = body
    if(!ip) throw 'Dữ liệu đầu vào không hợp lệ'

    const ipCheck = await DB.AdminIP.findOne({ ip: ip }) as IDBAdminIP
    if(!!ipCheck) throw 'IP đã tồn tại'

    await DB.AdminIP.create(body)
    await logAdmin(event, `Thêm IP <b>${ip}</b> vào White List`)

    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})