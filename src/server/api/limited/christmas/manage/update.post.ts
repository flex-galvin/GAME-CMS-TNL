import type { IAuth, IDBEgg } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'limited.update')

    const data = await readBody(event)
    const { time, jar, top, box } = data
    if(!time || !jar || !top || !box) throw 'Dữ liệu đầu vào không hợp lệ'

    // Update Active Time
    if(!!time.active){
      if(!time.start || !time.end) throw 'Thời gian không hợp lệ'
      const start = dayjs(time.start).unix()
      const end = dayjs(time.end).unix()
      if(start >= end) throw 'Thời gian không hợp lệ'
    }

    // Update Jar
    if(!!isNaN(parseInt(jar.share)) || parseInt(jar.share) <= 0) throw 'Chiết khấu đơn nạp vào hũ phải lớn hơn 0'
    if(!!isNaN(parseInt(jar.target)) || parseInt(jar.target) <= 0) throw 'Mục tiêu hũ phải lớn hơn 0'
    if(!!isNaN(parseInt(jar.min)) || parseInt(jar.min) <= 0) throw 'Số tiền nạp tối thiểu phải lơn hơn 0'
    if(!!isNaN(parseInt(jar.payreward)) || parseInt(jar.payreward) < 0) throw 'Tổng tiền nạp tối thiểu nhận thưởng các mốc phải >= 0'
    if(!jar.reward) throw 'Quà toàn dân của hũ không hợp lệ'
    data.jar.reward = jar.reward.map((i : any) => ({
      step: i.step,
      gift: i.gift.map((o : any) => ({
        item: o.item._id,
        amount: o.amount
      }))
    }))

    // Update Top
    if(!!isNaN(parseInt(top.max)) || parseInt(top.max) <= 0) throw 'Hạng tối đa phải lớn hơn 0'
    if(!top.reward) throw 'Quà thứ hạng không hợp lệ'
    data.top.reward = top.reward.map((i : any) => ({
      rank: i.rank,
      gift: i.gift.map((o : any) => ({
        item: o.item._id,
        amount: o.amount
      }))
    }))

    // Update Box
    if(!!isNaN(parseInt(box.share)) || parseInt(box.share) <= 0) throw 'Số tiền nạp để nhận sao phải lớn hơn 0'
    if(!!isNaN(parseInt(box.sticker)) || parseInt(box.sticker) < 0) throw 'Tỷ lệ ra mảnh ghép phải lớn hơn hoặc bằng 0'
    data.box.random = box.random.map(({ item, amount, percent } : any) => ({ item: item._id, amount, percent }))
    data.box.reward = box.reward.map((i : any) => ({
      step: i.step,
      gift: i.gift.map((o : any) => ({
        item: o.item._id,
        amount: o.amount
      }))
    }))

    // Update
    await DB.LimitedChristmas.updateMany({}, data)

    // Clear Cache
    const runtimeConfig = useRuntimeConfig()
    const REDIS_KEY = `${runtimeConfig.redisPREFIX || 'default'}:event:limited`
    !!DBRedis && await DBRedis.del(REDIS_KEY)

    await logAdmin(event, `Sửa cấu hình sự kiện hạn thời <b>Christmas</b>`)
    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})