import type { IAuth, IDBLimitedShop } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'shop.edit')

    const body = await readBody(event)
    const { _id, gift } = body
    if(!_id || !gift) throw 'Dữ liệu đầu vào không hợp lệ'

    const pack = await DB.LimitedShop.findOne({ _id: _id }).select('name') as IDBLimitedShop
    if(!pack) throw 'Mã không tồn tại'

    const giftFormat = gift.map((i : any) => ({ item: i.item._id, amount: i.amount}))
    await DB.LimitedShop.updateOne({ _id: pack._id }, { gift: giftFormat })

    // Clear Cache
    const runtimeConfig = useRuntimeConfig()
    const REDIS_KEY = `${runtimeConfig.redisPREFIX || 'default'}:event:limited`
    !!DBRedis && await DBRedis.del(REDIS_KEY)

    await logAdmin(event, `Sửa vật phẩm trong gói hạn giờ <b>${pack.name}</b>`)
    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})