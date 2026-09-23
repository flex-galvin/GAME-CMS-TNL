import type { IAuth, IDBEgg } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'limited.update')

    const data = await readBody(event)
    const { time, blood, top, lasthit } = data
    if(!time || !blood || !top || !lasthit) throw 'Dữ liệu đầu vào không hợp lệ'

    // Update Active Time
    if(!!time.active){
      if(!time.start || !time.end) throw 'Thời gian không hợp lệ'
      const start = dayjs(time.start).unix()
      const end = dayjs(time.end).unix()
      if(start >= end) throw 'Thời gian không hợp lệ'
    }

    // Update Jar
    if(!!isNaN(parseInt(blood.share)) || parseInt(blood.share) <= 0) throw 'Chiết khấu đơn nạp thành sát thương phải lớn hơn 0'
    if(!!isNaN(parseInt(blood.target)) || parseInt(blood.target) <= 0) throw 'Máu của Monster phải lớn hơn 0'
    if(!!isNaN(parseInt(blood.min)) || parseInt(blood.min) <= 0) throw 'Số tiền nạp tối thiểu phải lơn hơn 0'
    if(!!isNaN(parseInt(blood.payreward)) || parseInt(blood.payreward) < 0) throw 'Tổng tiền nạp tối thiểu nhận thưởng các mốc phải >= 0'
    if(!blood.reward) throw 'Quà toàn dân không hợp lệ'
    data.blood.reward = blood.reward.map((i : any) => ({
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
    if(!lasthit.reward) throw 'Quà kết liễu không hợp lệ'
    data.lasthit.reward = lasthit.reward.map((i : any) => ({
      item: i.item._id,
      amount: i.amount
    }))

    // Update
    await DB.LimitedMonster.updateMany({}, data)

    // Clear Cache
    const runtimeConfig = useRuntimeConfig()
    const REDIS_KEY = `${runtimeConfig.redisPREFIX || 'default'}:event:limited`
    !!DBRedis && await DBRedis.del(REDIS_KEY)

    await logAdmin(event, `Sửa cấu hình sự kiện hạn thời <b>Sát Quái</b>`)
    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})