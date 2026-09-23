import { IDBConfig, IAuth, IDBUser, IDBAdminIP } from "~~/types"

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()

  try {
    const auth = await getAuth(event) as IAuth
    const token = getCookie(event, 'eni-manage')
    if(!token) throw 'Chưa xác thực truy cập quản trị'

    const arrToken = token.split('-')
    if(arrToken.length != 2) throw 'Token xác thực không hỗ trợ'

    if(arrToken[0] == 'whitelist'){
      const check = await DB.AdminIP.findOne({ ip: arrToken[1] }).select('_id') as IDBAdminIP
      if(!check) throw 'IP White List không khả dụng'
    }
    else if(arrToken[0] == 'OTP'){
      const check = await DB.User.findOne({ _id: auth._id }).select('manage') as IDBUser
      if(check.manage.code != arrToken[1]) throw 'Mã OTP không khả dụng'
    }
    else if(arrToken[0] == 'PASS'){
      const check = await DB.Config.findOne({}).select('gm_password telegram') as IDBConfig
      if(!!check.telegram && !!check.telegram.manage) throw 'Vui lòng xác thực lại OTP'
      if(check.gm_password != arrToken[1]) throw 'Mã ủy quyền xác thực không hợp lệ'
    }
    else throw 'Kiểu token xác thực không hỗ trợ'
    return resp(event, { result: true })
  } 
  catch (e:any) {
    deleteCookie(event, 'eni-manage', runtimeConfig.public.cookieManageConfig)
    return resp(event, { code: 400, message: e.toString() })
  }
})