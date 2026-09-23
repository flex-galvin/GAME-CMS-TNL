import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 3) throw 'Chỉ Admin mới có quyền chình sửa'

    const data = await readBody(event)
    await DB.Config.updateMany({}, { permission: data })

    await logAdmin(event, 'Cập nhật <b>Quyền hạn</b>')
    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})