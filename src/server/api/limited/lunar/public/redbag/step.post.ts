import type { IAuth, IDBItem, IDBLimitedLunar, IDBLimitedLunarRedbagStepHistory, IDBLimitedLunarUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { server, role, step } = await readBody(event)
    if(!server) throw 'Vui lòng chọn máy chủ'
    if(!role) throw 'Vui lòng chọn nhân vật'
    if(!!isNaN(parseInt(step)) || parseInt(step) < 0) throw 'Mốc thưởng không hợp lệ'

    // Check Event
    let config = await DB.LimitedLunar.findOne({})
    .select('time redbag bonus') 
    .populate({ path: 'redbag.reward.gift.item', select: 'item_id type' })as IDBLimitedLunar
    if(!config) throw 'Không tìm thấy cấu hình sự kiện'
    
    // Check Time
    if(!config.time.active) throw 'Sự kiện chưa khai mở'
    const now = dayjs(Date.now()).unix()
    const start = dayjs(config.time.start).unix()
    const rewardTime = dayjs(config.time.end).add(1, 'day').unix()
    if(now < start || now > rewardTime) throw 'Sự kiện đã kết thúc'

    // Check Reward
    if(config.redbag.reward.length == 0) throw 'Sự kiện chưa có quà, vui lòng quay lại sau'
    const reward = config.redbag.reward.find((item : any) => item.step == step)
    if(!reward) throw 'Mốc nhận thưởng không tồn tại'
    if(reward.gift.length == 0) throw 'Mốc nhận chưa có phần thưởng, vui lòng quay lại sau'

    // Check User Event
    const userEvent = await DB.LimitedLunarUser.findOne({ user: auth._id }).select('redbag') as IDBLimitedLunarUser
    if(!userEvent) throw 'Vui lòng nạp tiền trong thời gian sự kiện để kích hoạt'

    // Check Step
    if(reward.step > userEvent.redbag.use) throw 'Bạn chưa đạt điều kiện nhận thưởng mốc này'

    // Check History
    const history = await DB.LimitedLunarRedbagStepHistory.findOne({ user: auth._id, step: reward.step }).select('_id') as IDBLimitedLunarRedbagStepHistory
    if(!!history) throw 'Bạn đã nhận thưởng mốc này rồi'

    // Make Bonus
    let bonus : number = 1
    if(!!config.bonus.enable.eve && !!config.bonus.start && !!config.bonus.end){
      const startBonus = dayjs(config.bonus.start).unix()
      const endBonus = dayjs(config.bonus.end).unix()
      if(startBonus <= now && now <= endBonus) bonus = config.bonus.value > 1 ? config.bonus.value : 1
    }

    // Format Gift
    const giftItem : Array<any> = []
    const giftCurrency : any = {}
    reward.gift.forEach(gift => {
      const item = gift.item as IDBItem

      if(item.type == 'game_item'){
        giftItem.push({ id: item.item_id, amount: Math.floor(gift.amount * bonus) })
      }
      if(!!['coin', 'wheel'].includes(item.type)){
        giftCurrency[`currency.${item.type}`] = Math.floor(gift.amount * bonus)
      }
    })

    // Send Gift
    if(giftItem.length > 0) await gameSendMail(event, {
      account: auth.username,
      server_id: server,
      role_id: role,
      title: 'Web Limited Lunar',
      content: `Nhận thưởng mốc mở ${reward.step} bao lì xì trên Web`,
      items: giftItem
    })
    if(Object.keys(giftCurrency).length) await DB.User.updateOne({ _id: auth._id },{ $inc: giftCurrency })
    

    // Save Log
    await DB.LimitedLunarRedbagStepHistory.create({
      user: auth._id,
      server: server,
      role: role,
      step: reward.step
    })

    // Send Data
    return resp(event, { message: 'Nhận thưởng thành công' }) 
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})