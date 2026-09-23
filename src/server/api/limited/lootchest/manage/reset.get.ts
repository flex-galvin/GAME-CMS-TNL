import type { IAuth, IDBLimitedLootChest } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'limited.update')
    
    const config = await DB.LimitedLootChest.findOne() as IDBLimitedLootChest
    if(!config) throw 'Không tìm thấy cấu hình'

    config.time.active = false
    config.time.start = null
    config.time.end = null
    config.money.now = 0
    config.money.need = config.money.min
    config.owner = null
    config.receive.status = false
    config.receive.role = null
    config.receive.server = null
    await config.save()

    // Clear Cache
    const runtimeConfig = useRuntimeConfig()
    const REDIS_KEY = `${runtimeConfig.redisPREFIX || 'default'}:event:limited`
    !!DBRedis && await DBRedis.del(REDIS_KEY)
    
    await logAdmin(event, `Đặt lại cấu hình sự kiện hạn thời <b>Cướp Rương</b>`)
    return resp(event, { message: 'Thao tác thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})