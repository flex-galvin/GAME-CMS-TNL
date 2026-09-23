import type { IAuth, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { email, phone } = await readBody(event)
    
    const user = await DB.User.findOne({ _id: auth._id }).select('email phone') as IDBUser
    if(!user) throw 'Tài khoản không tồn tại'

    let update = 0
    if(!user.email && !!email){
      if(!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) throw 'Định dạng Email không đúng'
      const check = await DB.User.findOne({ email: email }).select('_id') as IDBUser
      if(!!check) throw 'Địa chỉ Email đã tồn tại'
      user.email = email
      update++
    }

    if(!user.phone && !!phone){
      if(!phone.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)) throw 'Định dạng số điện thoại không đúng'
      const check = await DB.User.findOne({ phone: phone }).select('_id') as IDBUser
      if(!!check) throw 'Số điện thoại đã tồn tại'
      user.phone = phone
      update++
    }

    if(update > 0){
      await user.save()
      return resp(event, { message: 'Cập nhật thành công' })
    }
    else {
      return resp(event, { result: true })
    }
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})