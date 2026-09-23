import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'limited.update')

    const data = await readBody(event)
    const { time, reward } = data
    if(!time || !reward) throw 'Dữ liệu đầu vào không hợp lệ'

    // Update Active Time
    if(!!time.active){
      if(!time.start || !time.end) throw 'Thời gian không hợp lệ'
      const start = dayjs(time.start).unix()
      const end = dayjs(time.end).unix()
      if(start >= end) throw 'Thời gian không hợp lệ'
    }

    // Update Box
    data.reward = reward.map((i : any) => ({
      step: i.step,
      gift: i.gift.map((o : any) => ({
        item: o.item._id,
        amount: o.amount
      }))
    }))

    // Update
    await DB.LimitedPay.updateMany({}, data)

    // Clear Cache
    const runtimeConfig = useRuntimeConfig()
    const REDIS_KEY = `${runtimeConfig.redisPREFIX || 'default'}:event:limited`
    !!DBRedis && await DBRedis.del(REDIS_KEY)

    await logAdmin(event, `Sửa cấu hình sự kiện hạn thời <b>Nạp Tích Lũy</b>`)
    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})