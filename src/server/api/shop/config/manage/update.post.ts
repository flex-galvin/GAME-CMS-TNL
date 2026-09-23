import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'shop.configUpdate')

    const data = await readBody(event)
    const { maintenance, discount } = data
    if(!!isNaN(parseInt(discount.number)) || parseInt(discount.number) < 0) throw 'Dữ liệu đầu vào không hợp lệ'

    await DB.ShopConfig.updateMany({}, data)

    // Clear Cache
    const REDIS_PREFIX = runtimeConfig.redisPREFIX || 'default'
    if(DBRedis) await Promise.allSettled([
      DBRedis.del(`${REDIS_PREFIX}:config:public`),
      DBRedis.del(`${REDIS_PREFIX}:config:promo`),
      DBRedis.del(`${REDIS_PREFIX}:config:home`),
    ])

    await logAdmin(event, 'Cập nhật <b>cấu hình</b> cửa hàng')
    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})