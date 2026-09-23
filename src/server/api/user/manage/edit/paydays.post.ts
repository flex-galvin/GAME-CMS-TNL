import type { IAuth, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'user.editPay')

    const { _id, paydays, reason } = await readBody(event)
    if(!_id || !paydays) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!reason) throw 'Vui lòng nhập lý do'

    const { day, receive } = paydays
    if(
      !!isNaN(parseInt(day))
      || !!isNaN(parseInt(receive))
      || parseInt(day) < 0
      || parseInt(receive) < 0
    ) throw 'Dữ liệu đầu vào không hợp lệ'

    const user = await DB.User.findOne({_id: _id}).select('paydays username') as IDBUser
    if(!user) throw 'Người dùng không tồn tại'

    user.paydays.day = day
    user.paydays.receive = receive
    await user.save()
    
    await logAdmin(event, `Sửa dữ liệu liên nạp của tài khoản <b>${user.username}</b> với lý do <b>${reason}</b>`)
    return resp(event, { message: 'Thao tác thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})