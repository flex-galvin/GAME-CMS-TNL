import md5 from 'md5'
import { IDBUser } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const { username, password } = await readBody(event)
    if(!username || !password) throw 'Dữ liệu đầu vào không đủ'

    // Get User
    const user = await DB.User
    .findOne({ username: username.toLowerCase() })
    .select('username password block type currency') as IDBUser
    if(!user) throw 'Tài khoản không tồn tại'
    if(md5(password) != user.password) throw 'Mật khẩu không chính xác'
    if(user.block == 1) throw 'Tài khoản của bạn đang bị khóa'

    const result = {
      username: user.username,
      currency: user.currency,
      block: user.block,
      type: user.type
    }

    return resp(event, { message: 'Đăng nhập thành công', result: result })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})