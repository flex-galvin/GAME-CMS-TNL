import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'limited.update')

    const data = await readBody(event)
    const { time, jar, top, redbag, piece, bonus } = data
    if(!time || !jar || !top || !redbag || !piece || !bonus) throw 'Dữ liệu đầu vào không hợp lệ'

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
    if(!!isNaN(parseInt(top.need)) || parseInt(top.need) <= 0) throw 'Số điểm tối thiều để lên TOP phải lớn hơn 0'
    if(!!isNaN(parseInt(top.max)) || parseInt(top.max) <= 0) throw 'Hạng tối đa phải lớn hơn 0'
    if(!top.reward) throw 'Quà thứ hạng không hợp lệ'
    data.top.reward = top.reward.map((i : any) => ({
      rank: i.rank,
      gift: i.gift.map((o : any) => ({
        item: o.item._id,
        amount: o.amount
      }))
    }))

    // Update Red Bag
    if(!!isNaN(parseInt(redbag.day)) || parseInt(redbag.day) < 0) throw 'Số lì xì nhận miễn phí mỗi ngày phải lớn hơn hoặc bằng 0'
    if(!!isNaN(parseInt(redbag.share)) || parseInt(redbag.share) <= 0) throw 'Số tiền nạp để nhận lì xì phải lớn hơn 0'
    if(!!isNaN(parseInt(redbag.piece)) || parseInt(redbag.piece) < 0) throw 'Tỷ lệ ra mảnh ghép phải lớn hơn hoặc bằng 0'
    data.redbag.random = redbag.random.map(({ item, amount, percent } : any) => ({ 
      item: item._id, 
      amount, 
      percent 
    }))
    data.redbag.reward = redbag.reward.map((i : any) => ({
      step: i.step,
      gift: i.gift.map((o : any) => ({
        item: o.item._id,
        amount: o.amount
      }))
    }))

    // Update Piece
    if(!piece.percent) throw 'Dữ liệu tỷ lệ mảnh sai'
    if(!!isNaN(parseInt(piece.percent.A)) || parseInt(piece.percent.A) < 0) throw 'Tỷ lệ ra mảnh A phải lớn hơn hoặc bằng 0'
    if(!!isNaN(parseInt(piece.percent.B)) || parseInt(piece.percent.B) < 0) throw 'Tỷ lệ ra mảnh B phải lớn hơn hoặc bằng 0'
    if(!!isNaN(parseInt(piece.percent.C)) || parseInt(piece.percent.C) < 0) throw 'Tỷ lệ ra mảnh C phải lớn hơn hoặc bằng 0'
    if(!!isNaN(parseInt(piece.percent.D)) || parseInt(piece.percent.D) < 0) throw 'Tỷ lệ ra mảnh D phải lớn hơn hoặc bằng 0'
    data.piece.reward = piece.reward.map((i : any) => ({
      pieces: i.pieces.map((o : string) => o.toString()),
      gift: i.gift.map((o : any) => ({
        item: o.item._id,
        amount: o.amount
      }))
    }))

    // Update Bonus
    if(!!bonus.start && !!bonus.end){
      const start = dayjs(bonus.start).unix()
      const end = dayjs(bonus.end).unix()
      if(start >= end) throw 'Thời gian thưởng thêm không hợp lệ'
      if(!!isNaN(parseInt(bonus.value)) || parseInt(bonus.value) < 1) throw 'Trị số thưởng thêm không hợp lệ'
    }

    // Update
    await DB.LimitedLunar.updateMany({}, data)

    // Clear Cache
    const runtimeConfig = useRuntimeConfig()
    const REDIS_KEY = `${runtimeConfig.redisPREFIX || 'default'}:event:limited`
    !!DBRedis && await DBRedis.del(REDIS_KEY)

    await logAdmin(event, `Sửa cấu hình sự kiện hạn thời <b>Lunar</b>`)
    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})