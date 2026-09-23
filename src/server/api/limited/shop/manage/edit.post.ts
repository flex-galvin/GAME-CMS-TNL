import type { IAuth, IDBLimitedShop } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'shop.edit')

    const body = await readBody(event)
    const { _id, name, price, limit, time } = body
    if(!_id || !name) throw 'Dữ liệu đầu vào không hợp lệ'
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

    const pack = await DB.LimitedShop.findOne({ _id: _id }).select('name key') as IDBLimitedShop
    if(!pack) throw 'Mã không tồn tại'

    const key = formatVNString(name, '-')
    if(pack.key != key){
      const getByKey = await DB.ShopPack.findOne({ key: key }).select('_id') as IDBLimitedShop
      if(!!getByKey) throw 'Tên gói đã tồn tại'
      body.key = key
    }

    delete body['_id']
    await DB.LimitedShop.updateOne({ _id: pack._id }, body)

    // Clear Cache
    const runtimeConfig = useRuntimeConfig()
    const REDIS_KEY = `${runtimeConfig.redisPREFIX || 'default'}:event:limited`
    !!DBRedis && await DBRedis.del(REDIS_KEY)

    await logAdmin(event, `Sửa thông tin gói hạn giờ <b>${pack.name}</b>`)
    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})