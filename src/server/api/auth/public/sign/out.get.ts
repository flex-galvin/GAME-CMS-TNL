export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig(event)
    deleteCookie(event, 'token-auth', runtimeConfig.public.cookieConfig)
    deleteCookie(event, 'eni-manage', runtimeConfig.public.cookieManageConfig)
    return resp(event, { message: 'Đăng xuất thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})