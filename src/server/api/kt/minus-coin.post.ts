import md5 from 'md5'
import type { IDBUser } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const { username, value, reason, sign } = await readBody(event)
    if(!username) throw 'Không tìm thấy cài khoản đầu vào'
    if(!reason) throw 'Không tìm thấy lý do'
    if(!sign) throw 'Không tìm thấy khóa ủy quyền'
    if(!!isNaN(parseInt(value)) || parseInt(value) < 1) throw 'Số lượng Xu không hợp lệ'

    const signCheck = md5(username+'-'+value+'-'+'eni@kt888')
    if(signCheck != sign) throw 'Mã ủy quyền không chính xác'

    // Get User
    const user = await DB.User
    .findOne({ username: username.toLowerCase() })
    .select('currency') as IDBUser
    if(!user) throw 'Tài khoản không tồn tại'
    if(user.currency.coin < parseInt(value)) throw 'Số dư Xu của tài khoản không đủ để trừ'

    // Update 
    const update = await DB.User.findOneAndUpdate({ _id: user._id }, {
      $inc: { 'currency.coin': parseInt(value) * -1 }
    }, { new: true })
    .select('username currency') as IDBUser
    
    const result = {
      username: update.username,
      currency: update.currency,
    }

    await logUser(event, user._id, `Trừ <b>${value.toLocaleString('vi-VN')}</b> Xu với lý do <b>${reason}</b>`)
    return resp(event, { message: `Xử lý thành công`, result: result })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})