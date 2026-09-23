import type { IAuth, IDBItem, IDBLimitedLunar, IDBLimitedLunarJarHistory, IDBLimitedLunarUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { server, role } = await readBody(event)
    if(!server) throw 'Vui lòng chọn máy chủ'
    if(!role) throw 'Vui lòng chọn nhân vật'

    // Check Event
    let config = await DB.LimitedLunar.findOne({})
    .select('time eve bonus') 
    .populate({ path: 'eve.gift.item', select: 'item_id type' })as IDBLimitedLunar
    if(!config) throw 'Không tìm thấy cấu hình sự kiện'
    
    // Check Time
    if(!config.time.active) throw 'Sự kiện chưa khai mở'
    const now = dayjs(Date.now()).unix()
    const start = dayjs(config.time.start).unix()
    const rewardTime = dayjs(config.time.end).add(1, 'day').unix()
    if(now < start || now > rewardTime) throw 'Sự kiện đã kết thúc'

    // Check Reward
    if(config.eve.gift.length == 0) throw 'Sự kiện chưa có quà, vui lòng quay lại sau'

    // Check User Event
    const userEvent = await DB.LimitedLunarUser.findOne({ user: auth._id }).select('eve') as IDBLimitedLunarUser
    if(!userEvent) throw 'Bạn không có trong danh sách nhận thưởng'
    if(!!userEvent.eve) throw 'Bạn đã nhận thưởng này rồi'

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
    config.eve.gift.forEach(gift => {
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
      content: `Nhận thưởng quà tết nguyên đán trên Web`,
      items: giftItem
    })
    if(Object.keys(giftCurrency).length) await DB.User.updateOne({ _id: auth._id },{ $inc: giftCurrency })

    // Save User
    userEvent.eve = true
    await userEvent.save()

    // Send Data
    return resp(event, { message: 'Nhận thưởng thành công' }) 
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})