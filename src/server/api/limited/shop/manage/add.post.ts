import type { IAuth, IDBLimitedShop } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'shop.add')

    const body = await readBody(event)
    const { name, price, limit, time } = body
    if(!name) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!time) throw 'Thời gian không hợp lệ'
    if(!time.start || !time.end) throw 'Thời gian không hợp lệ'
    if(
      !!isNaN(parseInt(price)) 
      || parseInt(price) < 1
    ) throw 'Dữ liệu giá mua không hợp lệ'
    if(
      !!isNaN(parseInt(limit)) 
      || parseInt(limit) < 0
    ) throw 'Dữ liệu giới hạn không hợp lệ'

    const start = dayjs(time.start).unix()
    const end = dayjs(time.end).unix()
    if(start >= end) throw 'Thời gian không hợp lệ'

    const key = formatVNString(name, '-')
    const getByKey = await DB.LimitedShop.findOne({ key: key }).select('_id') as IDBLimitedShop
    if(!!getByKey) throw 'Tên gói đã tồn tại'
    body.key = key

    await DB.LimitedShop.create(body)

    // Clear Cache
    const runtimeConfig = useRuntimeConfig()
    const REDIS_KEY = `${runtimeConfig.redisPREFIX || 'default'}:event:limited`
    !!DBRedis && await DBRedis.del(REDIS_KEY)

    await logAdmin(event, `Thêm gói hạn giờ <b>${name}</b>`)
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})