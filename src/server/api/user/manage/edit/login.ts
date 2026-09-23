import type { IAuth, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'user.editLogin')

    const { _id, login } = await readBody(event)
    if(!_id || !login) throw 'Dữ liệu đầu vào không hợp lệ'

    const { month, total } = login
    if(!month || !total) throw 'Dữ liệu đầu vào không hợp lệ'
    if(
      !!isNaN(parseInt(month))
      || !!isNaN(parseInt(total))
      || parseInt(month) < 0
      || parseInt(total) < 0
    ) throw 'Dữ liệu đầu vào không hợp lệ'

    const user = await DB.User.findOne({_id: _id}).select('type username') as IDBUser
    if(!user) throw 'Người dùng không tồn tại'

    const update : any = {
      'login.month': parseInt(month),
      'login.total': parseInt(total)
    }

    await DB.User.updateOne({ _id: _id }, update)

    await logAdmin(event, `Sửa dữ liệu <b>đăng nhập</b> tài khoản <b>${user.username}</b>`)
    return resp(event, { message: 'Sửa dữ liệu đăng nhập thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})