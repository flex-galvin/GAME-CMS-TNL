import type { IAuth, IDBEgg } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'limited.update')

    const data = await readBody(event)
    const { time, money, reward } = data
    if(!time || !money || !reward) throw 'Dữ liệu đầu vào không hợp lệ'

    // Update Active Time
    if(!!time.active){
      if(!time.start || !time.end) throw 'Thời gian không hợp lệ'
      const start = dayjs(time.start).unix()
      const end = dayjs(time.end).unix()
      if(start >= end) throw 'Thời gian không hợp lệ'
    }

    // Check Money 
    if(!!isNaN(parseInt(money.min)) || parseInt(money.min) <= 0) throw 'Số tiền nhỏ nhất khi bắt đầu sự kiện phải lớn hơn 0'
    if(!!isNaN(parseInt(money.need)) || parseInt(money.need) <= 0) throw 'Số tiền cần để cướp đoạt phải lớn hơn 0'
    if(parseInt(money.need) <= parseInt(money.now)) throw 'Số tiền cần để cướp đoạt phải lớn hơn số tiền cướp đoạt hiện tại'
    
    // Update Reward
    data.reward = reward.map((i : any) => ({
      item: i.item._id,
      amount: i.amount
    }))

    // Update
    delete data['owner']
    delete data['receive']
    await DB.LimitedLootChest.updateMany({}, data)

    // Clear Cache
    const runtimeConfig = useRuntimeConfig()
    const REDIS_KEY = `${runtimeConfig.redisPREFIX || 'default'}:event:limited`
    !!DBRedis && await DBRedis.del(REDIS_KEY)

    await logAdmin(event, `Sửa cấu hình sự kiện hạn thời <b>Cướp Rương</b>`)
    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})