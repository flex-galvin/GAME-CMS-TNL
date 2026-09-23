import type { H3Event } from 'h3'
import type { IAuth, IDBAdminIP, IDBConfig, IDBUser } from '~~/types'

export default async (event: H3Event, type : string) : Promise<void> => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const auth = event.context.auth as IAuth

    const token = getCookie(event, 'eni-manage')
    if(!token) throw 'Chưa xác thực truy cập quản trị'
    const arrToken = token.split('-')
    if(arrToken.length != 2) throw 'Token xác thực không hỗ trợ'
    if(arrToken[0] == 'whitelist'){
      const check = await DB.AdminIP.findOne({ ip: arrToken[1] }).select('_id') as IDBAdminIP
      if(!check){
        deleteCookie(event, 'eni-manage', runtimeConfig.public.cookieManageConfig)
        throw 'IP White List không khả dụng'
      }
    }
    else if(arrToken[0] == 'OTP'){
      const check = await DB.User.findOne({ _id: auth._id }).select('manage') as IDBUser
      if(check.manage.code != arrToken[1]){
        deleteCookie(event, 'eni-manage', runtimeConfig.public.cookieManageConfig)
        throw 'Mã OTP không khả dụng'
      }
    }
    else if(arrToken[0] == 'PASS'){
      const check = await DB.Config.findOne({}).select('gm_password telegram') as IDBConfig
      if(!!check.telegram && !!check.telegram.manage){
        deleteCookie(event, 'eni-manage', runtimeConfig.public.cookieManageConfig)
        throw 'Vui lòng xác thực lại OTP'
      }
      if(check.gm_password != arrToken[1]){
        deleteCookie(event, 'eni-manage', runtimeConfig.public.cookieManageConfig)
        throw 'Mã ủy quyền xác thực không hợp lệ'
      }
    }
    else {
      deleteCookie(event, 'eni-manage', runtimeConfig.public.cookieManageConfig)
      throw 'Kiểu token xác thực không hỗ trợ'
    }
    
    const config = await DB.Config.findOne().select('permission') as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình trang'

    const permission = config.permission
    const typeArray = type.split('.')

    if(typeArray.length == 2){
      // @ts-expect-error
      if(!permission[typeArray[0]]) throw 'Kiểu dữ liệu phân quyền 1 không hợp lệ'
      // @ts-expect-error
      if(!permission[typeArray[0]][typeArray[1]]) throw 'Kiểu dữ liệu phân quyền 2 không hợp lệ'
      // @ts-expect-error
      const arrType = permission[typeArray[0]][typeArray[1]]
      if(!arrType.includes(auth.type)) throw 'Bạn không có quyền thao tác'
    }
    else if(typeArray.length == 3){
      // @ts-expect-error
      if(!permission[typeArray[0]]) throw 'Kiểu dữ liệu phân quyền 1 không hợp lệ'
      // @ts-expect-error
      if(!permission[typeArray[0]][typeArray[1]]) throw 'Kiểu dữ liệu phân quyền 2 không hợp lệ'
      // @ts-expect-error
      if(!permission[typeArray[0]][typeArray[1]][typeArray[2]]) throw 'Kiểu dữ liệu phân quyền 3 không hợp lệ'
      // @ts-expect-error
      const arrType = permission[typeArray[0]][typeArray[1]][typeArray[2]]
      if(!arrType.includes(auth.type)) throw 'Bạn không có quyền thao tác'
    }
    else throw 'Kiểu phân quyền không hỗ trợ'
  }
  catch (e:any) {
    throw e.toString()
  }
}