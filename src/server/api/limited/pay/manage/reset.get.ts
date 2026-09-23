import type { IAuth, IDBLimitedPay } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'limited.update')
    
    const config = await DB.LimitedPay.findOne() as IDBLimitedPay
    if(!config) throw 'Không tìm thấy cấu hình'

    config.time.active = false
    config.time.start = null
    config.time.end = null
    await DB.LimitedPayUser.deleteMany({})
    await DB.LimitedPayHistory.deleteMany({})
    await config.save()

    // Clear Cache
    const runtimeConfig = useRuntimeConfig()
    const REDIS_KEY = `${runtimeConfig.redisPREFIX || 'default'}:event:limited`
    !!DBRedis && await DBRedis.del(REDIS_KEY)
    
    await logAdmin(event, `Đặt lại cấu hình sự kiện hạn thời <b>Nạp Tích Lũy</b>`)
    return resp(event, { message: 'Thao tác thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})