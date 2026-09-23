import { IDBAdminIP } from "~~/types"

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()

  try {
    const IP = getRequestIP(event, { xForwardedFor: true })
    const check = await DB.AdminIP.findOne({ ip: IP }) as IDBAdminIP
    if(!check) throw `IP ${IP} chưa có trong White List, vui lòng nhập mật khẩu ủy quyển hoặc OTP`

    setCookie(event, 'eni-manage', `whitelist-${IP}`, runtimeConfig.public.cookieManageConfig)
    return resp(event, { result: 'Success' })
  } 
  catch (e:any) {
    deleteCookie(event, 'eni-manage', runtimeConfig.public.cookieManageConfig)
    return resp(event, { code: 400, message: e.toString() })
  }
})