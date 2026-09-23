import md5 from 'md5'
import { IDBConfig, IDBUser } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const { username, password } = await readBody(event)
    if(!username || !password) throw 'Vui lòng nhập đầy đủ thông tin'

    // Get User
    const user = await DB.User
    .findOne({ username: username.toLowerCase() })
    .select('username password block type') as IDBUser
    
    // Check User
    if(!user) throw 'Tài khoản không tồn tại'
    if(md5(password) != user.password) throw 'Mật khẩu không chính xác'
    if(user.block == 1) throw 'Tài khoản của bạn đang bị khóa'

    // Check Config Enable
    const config = await DB.Config.findOne({}).select('enable') as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình trang'
    if(user.type < 1 && !config.enable.signin) throw 'Chức năng xác thực đang bảo trì'

    return resp(event, { message: 'Xác thực tài khoản thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})