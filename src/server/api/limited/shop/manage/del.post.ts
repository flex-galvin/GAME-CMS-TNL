import type { IAuth, IDBLimitedShop } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'shop.del')

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const pack = await DB.LimitedShop.findOne({ _id: _id }).select('name') as IDBLimitedShop
    if(!pack) throw 'Gói không tồn tại'
    
    const histories = await DB.LimitedShopHistory.count({ pack: pack._id })
    if(histories > 0) throw 'Không thể xóa gói đã có dữ liệu lịch sử'

    await DB.LimitedShop.deleteOne({ _id: pack._id })

    // Clear Cache
    const runtimeConfig = useRuntimeConfig()
    const REDIS_KEY = `${runtimeConfig.redisPREFIX || 'default'}:event:limited`
    !!DBRedis && await DBRedis.del(REDIS_KEY)
    
    await logAdmin(event, `Xóa gói hạn thời <b>${pack.name}</b>`)
    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})