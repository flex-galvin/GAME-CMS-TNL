import type { IAuth, IDBItem, IDBLimitedMonster, IDBLimitedMonsterBloodHistory, IDBLimitedMonsterUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { server, role, step } = await readBody(event)
    if(!server) throw 'Vui lòng chọn máy chủ'
    if(!role) throw 'Vui lòng chọn nhân vật'
    if(!!isNaN(parseInt(step)) || parseInt(step) < 0) throw 'Mốc thưởng không hợp lệ'

    // Check Event
    let config = await DB.LimitedMonster.findOne({})
    .select('time blood') 
    .populate({ path: 'blood.reward.gift.item', select: 'item_id type' })as IDBLimitedMonster
    if(!config) throw 'Không tìm thấy cấu hình sự kiện'
    
    // Check Time
    if(!config.time.active) throw 'Sự kiện chưa khai mở'
    const now = dayjs(Date.now()).unix()
    const start = dayjs(config.time.start).unix()
    const rewardTime = dayjs(config.time.end).add(1, 'day').unix()
    if(now < start || now > rewardTime) throw 'Sự kiện đã kết thúc'

    // Check Reward
    if(config.blood.reward.length == 0) throw 'Sự kiện chưa có quà, vui lòng quay lại sau'
    const reward = config.blood.reward.find((item : any) => item.step == step)
    if(!reward) throw 'Mốc nhận thưởng không tồn tại'
    if(reward.gift.length == 0) throw 'Mốc nhận chưa có phần thưởng, vui lòng quay lại sau'

    // Check Step
    let process = Math.round((config.blood.now / config.blood.target) * 100)
    process = process >= 100 ? 100 : process
    process = 100 - process
    if(reward.step < process) throw 'Mốc nhận chưa khai mở'

    // Check User Event
    const userEvent = await DB.LimitedMonsterUser.findOne({ user: auth._id }).select('point') as IDBLimitedMonsterUser
    if(!userEvent) throw 'Bạn không có trong danh sách nhận thưởng'
    if(userEvent.point <= 0) throw 'Vui lòng nạp tiền để nhận thưởng'
    if(userEvent.point < (config.blood.payreward || 500000)) throw `Vui lòng nạp thêm ${((config.blood.payreward || 500000) - userEvent.point).toLocaleString('vi-VN')} VNĐ trong thời gian sự kiện để nhận thưởng`

    // Check History
    const history = await DB.LimitedMonsterBloodHistory.findOne({ user: auth._id, step: reward.step }).select('_id') as IDBLimitedMonsterBloodHistory
    if(!!history) throw 'Bạn đã nhận thưởng mốc này rồi'

    // Format Gift
    const giftItem : Array<any> = []
    const giftCurrency : any = {}
    reward.gift.forEach(gift => {
      const item = gift.item as IDBItem

      if(item.type == 'game_item'){
        giftItem.push({ id: item.item_id, amount: gift.amount })
      }
      if(!!['coin', 'wheel'].includes(item.type)){
        giftCurrency[`currency.${item.type}`] = gift.amount
      }
    })

    // Send Gift
    if(giftItem.length > 0) await gameSendMail(event, {
      account: auth.username,
      server_id: server,
      role_id: role,
      title: 'Web Limited Monster',
      content: `Nhận thưởng mốc ${reward.step} tiêu diệt quái vật trên Web`,
      items: giftItem
    })
    if(Object.keys(giftCurrency).length) await DB.User.updateOne({ _id: auth._id },{ $inc: giftCurrency })
    

    // Save Log
    await DB.LimitedMonsterBloodHistory.create({
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