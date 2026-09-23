import type { IAuth, IDBLimitedHalloween } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'limited.update')
    
    const config = await DB.LimitedHalloween.findOne() as IDBLimitedHalloween
    if(!config) throw 'Không tìm thấy cấu hình'

    config.time.active = false
    config.time.start = null
    config.time.end = null
    config.jar.now = 0
    await DB.LimitedHalloweenUser.deleteMany({})
    await DB.LimitedHalloweenJarHistory.deleteMany({})
    await DB.LimitedHalloweenTopHistory.deleteMany({})
    await DB.LimitedHalloweenPumpkinHistory.deleteMany({})
    await config.save()

    // Clear Cache
    const runtimeConfig = useRuntimeConfig()
    const REDIS_KEY = `${runtimeConfig.redisPREFIX || 'default'}:event:limited`
    !!DBRedis && await DBRedis.del(REDIS_KEY)
    
    return resp(event, { message: 'Đặt lại cấu hình thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})