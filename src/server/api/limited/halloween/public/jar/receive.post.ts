import type { IAuth, IDBItem, IDBLimitedHalloween, IDBLimitedHalloweenJarHistory, IDBLimitedHalloweenUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { server, role } = await readBody(event)
    if(!server) throw 'Vui lòng chọn máy chủ'
    if(!role) throw 'Vui lòng chọn nhân vật'

    // Check Event
    let config = await DB.LimitedHalloween.findOne({})
    .select('time jar') 
    .populate({ path: 'jar.reward.item', select: 'item_id type' })as IDBLimitedHalloween
    if(!config) throw 'Không tìm thấy cấu hình sự kiện Halloween'
    if(!config.time.active) throw 'Sự kiện chưa khai mở'
    if(config.jar.now < config.jar.target) throw 'Hũ chưa đầy, không thể nhận thưởng'
    if(config.jar.reward.length == 0) throw 'Hũ chưa có quà, vui lòng quay lại sau'

    // Check Time
    const now = dayjs(Date.now()).unix()
    const start = dayjs(config.time.start).unix()
    const rewardTime = dayjs(config.time.end).add(1, 'day').unix()
    if(now < start || now > rewardTime) throw 'Sự kiện đã kết thúc'

    // Check User Event
    const userEvent = await DB.LimitedHalloweenUser.findOne({ user: auth._id }).select('point') as IDBLimitedHalloweenUser
    if(!userEvent) throw 'Bạn không có trong danh sách nhận thưởng'
    if(userEvent.point <= 0) throw 'Vui lòng nạp tiền để nhận thưởng'
    if(userEvent.point < (config.jar.payreward || 500000)) throw `Vui lòng nạp thêm ${((config.jar.payreward || 500000) - userEvent.point).toLocaleString('vi-VN')} VNĐ trong thời gian sự kiện để nhận thưởng`

    // Check History
    const history = await DB.LimitedHalloweenJarHistory.findOne({ user: auth._id }).select('_id') as IDBLimitedHalloweenJarHistory
    if(!!history) throw 'Bạn đã nhận thưởng toàn dân rồi'

    // Format Gift
    const giftItem : Array<any> = []
    const giftCurrency : any = {}
    config.jar.reward.forEach(gift => {
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
      title: 'Web Limited Halloween',
      content: 'Nhận thưởng toàn dân Hũ Bí Ngô trên Web',
      items: giftItem
    })
    if(Object.keys(giftCurrency).length) await DB.User.updateOne({ _id: auth._id },{ $inc: giftCurrency })
    

    // Save Log
    await DB.LimitedHalloweenJarHistory.create({
      user: auth._id,
      server: server,
      role: role
    })

    // Send Data
    return resp(event, { message: 'Nhận thưởng thành công' }) 
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})