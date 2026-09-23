import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'payment.configUpdate')

    const data = await readBody(event)
    const { pay, min, happyhour } = data
    if(!pay) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!!isNaN(parseInt(pay.number)) || parseInt(pay.number) < 0) throw 'Dữ liệu khuyến mãi tích nạp không hợp lệ'
    if(!!isNaN(parseInt(min)) || parseInt(min) < 0) throw 'Dữ liệu nạp tối thiều không hợp lệ'
    if(!!happyhour){
      const { start, end, number } = happyhour
      if(!!isNaN(parseInt(number)) || parseInt(number) < 0) throw 'Dữ liệu nạp giờ vàng không hợp lệ'
      if(!start || !end) throw 'Vui lòng điền đủ thời gian khuyễn mãi nạp giờ vàng'
    }

    await DB.PaymentConfig.updateMany({}, data)

    // Clear Cache
    const REDIS_PREFIX = runtimeConfig.redisPREFIX || 'default'
    if(DBRedis) await Promise.allSettled([
      DBRedis.del(`${REDIS_PREFIX}:config:public`),
      DBRedis.del(`${REDIS_PREFIX}:config:promo`),
      DBRedis.del(`${REDIS_PREFIX}:config:home`),
    ])

    await logAdmin(event, 'Cập nhật <b>cấu hình</b> nạp xu')
    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})