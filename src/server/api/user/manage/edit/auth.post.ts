import md5 from 'md5'
import type { IAuth, IDBUser } from '~~/types'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'user.editAuth')

    const { _id, email, phone, password, type, block } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'
    if(type < 0 || type > 3) throw 'Dữ liệu quyền hạn không hợp lệ'
    if(block < 0 || block > 1) throw 'Dữ liệu khóa không hợp lệ'

    const user = await DB.User.findOne({_id: _id})
    .select('username email phone type block') as IDBUser

    if(!user) throw 'Người dùng không tồn tại'
    if(user.type == 3 && auth.type < 3) throw 'Không thể sửa thông tin tài khoản'
    if(user.type == 2 && auth.type < 2) throw 'Không thể sửa thông tin tài khoản'

    const update : any = { type: type, block: block }
    const change = []

    if(!!email && user.email != email){
      const check = await DB.User.findOne({ email: email }).select('_id') as IDBUser
      if(!!check) throw 'Email đã tồn tại'
      update['email'] = email
      change.push('Email')
    }
    if(!!phone && user.phone != phone){
      const check = await DB.User.findOne({ phone: phone }).select('_id') as IDBUser
      if(!!check) throw 'Số điện thoại đã tồn tại'
      update['phone'] = phone
      change.push('Số điện thoại')
    }
    if(!!password){
      const runtimeConfig = useRuntimeConfig()
      const token = jwt.sign({
        _id : user._id
      }, runtimeConfig.apiSecret, { expiresIn: '360d' })

      update['password'] = md5(password)
      update['token'] = token
      change.push('Mật khẩu')
    }
    if(user.type != type){
      if(type == 3 && auth.type < 3) throw 'Không thể nâng quyền tài khoản'
      if(type == 2 && auth.type < 3) throw 'Không thể nâng quyền tài khoản'

      update['type'] = type
      change.push('Quyền tài khoản')
    }
    if(user.block != block){
      update['block'] = block
      change.push('Trạng thái khóa')
    }

    if(change.length > 0){
      await DB.User.updateOne({ _id: _id }, update)
      await logAdmin(event, `Sửa <b>${change.join(', ')}</b> của tài khoản <b>${user.username}</b>`)
    }
    
    !!IO && IO.to(user._id.toString()).emit('auth-update')
    return resp(event, { message: 'Sửa thông tin thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})