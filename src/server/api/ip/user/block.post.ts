import type { IAuth, IDBLogBlockIP } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'IP.user.action')

    const body = await readBody(event)
    const { ip, action } = body
    if(!ip || !action) throw 'Dữ liệu đầu vào không hợp lệ'

    if(action == 'block'){
      const lockIP = await DB.LogBlockIP.findOne({ ip: ip }).select('_id') as IDBLogBlockIP
      if(!!lockIP) throw 'Địa chỉ IP đã có trong danh sách khóa'

      await DB.LogBlockIP.create({ ip: ip })
      await logAdmin(event, `Khóa IP <b>${ip}</b>`)

      return resp(event, { message: 'Khóa IP thành công' })
    }

    else if(action == 'unblock'){
      const lockIP = await DB.LogBlockIP.findOne({ ip: ip }).select('_id') as IDBLogBlockIP
      if(!lockIP) throw 'Địa chỉ IP không có trong danh sách khóa'

      await DB.LogBlockIP.deleteMany({ ip: ip })
      await logAdmin(event, `Mở khóa IP <b>${ip}</b>`)

      return resp(event, { message: 'Mở khóa IP thành công' })
    }

    else throw 'Hành động không hỗ trợ'
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})