import type { IAuth, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'user.editPay')

    const { _id, paymusty, reason } = await readBody(event)
    if(!_id || !paymusty) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!Array.isArray(paymusty)) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!reason) throw 'Vui lòng nhập lý do'

    const user = await DB.User.findOne({_id: _id}).select('paymusty username') as IDBUser
    if(!user) throw 'Người dùng không tồn tại'

    user.paymusty = paymusty
    await user.save()
    
    await logAdmin(event, `Sửa dữ liệu đơn nạp của tài khoản <b>${user.username}</b> với lý do <b>${reason}</b>`)
    return resp(event, { message: 'Thao tác thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})