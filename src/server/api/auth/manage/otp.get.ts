import { IDBConfig, IAuth, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()

  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const config = await DB.Config.findOne().select('telegram name') as IDBConfig
    if(!config.telegram) throw 'Hệ thống chưa cấu hình OTP'
    if(!config.telegram.manage) throw 'Hệ thống chưa cấu hình OTP'

    const user = await DB.User.findOne({ _id: auth._id }).select('username manage') as IDBUser
    if(!user) throw 'Tài khoản không khả dụng'
    if(!!user.manage && !!user.manage.expired && !!user.manage.code){
        if (new Date(user.manage.expired) > new Date()) throw 'Bạn đang có mã xác minh đang khả dụng, vui lòng thử lại sau'
    }
    user.manage.code = Math.floor(100000 + Math.random() * 900000).toString()
    user.manage.expired = new Date(Date.now() + 5 * 60 * 1000)
    await user.save()
    
    const IP = getRequestIP(event, { xForwardedFor: true })
    const timeFormat = formatDate(user.manage.expired)
    await sendTele({
        url: config.telegram.manage,
        message: `
          Mã OTP truy cập quản trị viên
          » Trò chơi: ${config.name}
          » Tài khoản: ${user.username}
          » Mã OTP: ${user.manage.code}
          » Hạn sử dụng: ${timeFormat.day}/${timeFormat.month}/${timeFormat.year} - ${timeFormat.hour}:${timeFormat.minute}
          » IP truy cập: ${IP}
        `
    })

    deleteCookie(event, 'eni-manage', runtimeConfig.public.cookieManageConfig)
    return resp(event, { message: 'Gửi mã OTP thành công' })
  } 
  catch (e:any) {
    deleteCookie(event, 'eni-manage', runtimeConfig.public.cookieManageConfig)
    return resp(event, { code: 400, message: e.toString() })
  }
})