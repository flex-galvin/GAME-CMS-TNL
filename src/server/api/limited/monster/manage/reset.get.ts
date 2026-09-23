import type { IAuth, IDBLimitedMonster } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'limited.update')
    
    const config = await DB.LimitedMonster.findOne() as IDBLimitedMonster
    if(!config) throw 'Không tìm thấy cấu hình'

    config.time.active = false
    config.time.start = null
    config.time.end = null
    config.blood.now = 0
    config.lasthit.user = null
    config.lasthit.receive.status = false
    config.lasthit.receive.role = null
    config.lasthit.receive.server = null
    await DB.LimitedMonsterUser.deleteMany({})
    await DB.LimitedMonsterBloodHistory.deleteMany({})
    await DB.LimitedMonsterTopHistory.deleteMany({})
    await config.save()

    // Clear Cache
    const runtimeConfig = useRuntimeConfig()
    const REDIS_KEY = `${runtimeConfig.redisPREFIX || 'default'}:event:limited`
    !!DBRedis && await DBRedis.del(REDIS_KEY)
    
    await logAdmin(event, `Đặt lại cấu hình sự kiện hạn thời <b>Sát Quái</b>`)
    return resp(event, { message: 'Thao tác thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})