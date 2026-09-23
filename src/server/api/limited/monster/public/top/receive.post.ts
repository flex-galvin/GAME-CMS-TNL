import { Types } from "mongoose"
import type { IAuth, IDBItem, IDBLimitedMonster, IDBLimitedMonsterTopHistory, IDBLimitedMonsterUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { server, role, rank } = await readBody(event)
    if(!server) throw 'Vui lòng chọn máy chủ'
    if(!role) throw 'Vui lòng chọn nhân vật'

    // Check Event
    let config = await DB.LimitedMonster.findOne({})
    .select('time top') 
    .populate({ path: 'top.reward.gift.item', select: 'item_id type' })as IDBLimitedMonster
    if(!config) throw 'Không tìm thấy cấu hình sự kiện'
    if(!config.time.active) throw 'Sự kiện chưa khai mở'
    if(config.top.reward.length == 0) throw 'Thứ hạng chưa cấu hình phần thưởng, vui lòng quay lại sau'

    // Check Time
    const now = dayjs(Date.now()).unix()
    const start = dayjs(config.time.start).unix()
    const end = dayjs(config.time.end).unix()
    const rewardTime = dayjs(config.time.end).add(1, 'day').unix()
    if(now < start || now > rewardTime) throw 'Sự kiện đã kết thúc'
    if(now < end) throw 'Chưa tới thời gian nhận thưởng'

    // Check User Event
    const userEvent = await DB.LimitedMonsterUser.findOne({ user: auth._id }).select('_id') as IDBLimitedMonsterUser
    if(!userEvent) throw 'Bạn không có trong danh sách tham gia sự kiện'

    // Check History
    const history = await DB.LimitedMonsterTopHistory.findOne({ user: auth._id }).select('_id') as IDBLimitedMonsterTopHistory
    if(!!history) throw 'Bạn đã nhận thưởng rồi'

    // Get Rank
    const ranks = await DB.LimitedMonsterUser.aggregate([
      { $match: { point: { $gte: config.top.need || 1 } } },
      { $sort: { point: -1, createdAt: 1 } },
      { $limit: config.top.max },
      { $project: { user: 1, point: 1 } }
    ])
    ranks.map((item, index) => item.rank = index + 1)
    if(ranks.length == 0) throw 'Bảng xếp hạng trống'

    // Check Rank
    const rankUserData = ranks.find(i => i.user.toString() == auth._id.toString())
    if(!rankUserData) throw 'Không tìm thấy thứ hạng của bạn'
    if(rankUserData.rank != rank) throw 'Thứ hạng nhận thưởng không hợp lệ'
    const rankUser = rankUserData.rank

    // Get Gift
    const reward = config.top.reward
    const index = reward.findLastIndex(i => i.rank == rankUser)
    if(index < 0) throw 'Quà cho thứ hạng của bạn chưa được cập nhật, vui lòng quay lại sau'
    const gifts = reward[index]['gift']

    // Format Gift
    const giftItem : Array<any> = []
    const giftCurrency : any = {}
    gifts.forEach(gift => {
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
      content: `Nhận thưởng TOP ${rankUser} tiêu diệt quái vật trên Web`,
      items: giftItem
    })
    if(Object.keys(giftCurrency).length) await DB.User.updateOne({ _id: auth._id },{ $inc: giftCurrency })
    
    // Save Log
    await DB.LimitedMonsterTopHistory.create({
      user: auth._id,
      server: server,
      role: role,
      top: rankUser
    })

    // Send Data
    return resp(event, { message: 'Nhận thưởng thành công' }) 
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})