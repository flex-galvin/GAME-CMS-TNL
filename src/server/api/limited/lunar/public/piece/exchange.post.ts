import { Types } from "mongoose"
import type { IAuth, IDBItem, IDBLimitedLunar, IDBLimitedLunarTopHistory, IDBLimitedLunarUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { server, role, _id, pieces } = await readBody(event)
    if(!_id) throw 'Vui lòng chọn bộ mảnh ghép'
    if(!pieces) throw 'Vui lòng chọn bộ mảnh ghép'
    if(!server) throw 'Vui lòng chọn máy chủ'
    if(!role) throw 'Vui lòng chọn nhân vật'

    // Check Event
    let config = await DB.LimitedLunar.findOne({})
    .select('time piece bonus') 
    .populate({ path: 'piece.reward.gift.item', select: 'item_id type' })as IDBLimitedLunar
    if(!config) throw 'Không tìm thấy cấu hình sự kiện Lunar'
    if(!config.time.active) throw 'Sự kiện chưa khai mở'
    if(config.piece.reward.length == 0) throw 'Sự kiện chưa cấu hình phần thưởng đổi mảnh, vui lòng quay lại sau'

    // Check Time
    const now = dayjs(Date.now()).unix()
    const start = dayjs(config.time.start).unix()
    const end = dayjs(config.time.end).unix()
    const rewardTime = dayjs(config.time.end).add(1, 'day').unix()
    if(now < start || now > rewardTime) throw 'Sự kiện đã kết thúc'

    // Check User Event
    const userEvent = await DB.LimitedLunarUser.findOne({ user: auth._id }).select('piece') as IDBLimitedLunarUser
    if(!userEvent) throw 'Bạn không có trong danh sách tham gia sự kiện'
    if(!userEvent.piece) throw 'Dữ liệu tài khoản lỗi, vui lòng thử lại sau'

    // Check Milestone
    const milestone = config.piece.reward.find((i : any) => i._id == _id)
    if(!milestone) throw 'Bộ mảnh chưa được cấu hình, vui lòng quay lại sau'
    if(milestone.gift.length == 0) throw 'Bộ mảnh chưa cấu hình phần thưởng, vui lòng quay lại sau'

    // Check Piece
    const updateUser : any = {}
    for (let i = 0; i < milestone.pieces.length; i++) {
      const piece = milestone.pieces[i]

      // @ts-expect-error
      if(!userEvent.piece[piece] || (!!userEvent.piece[piece] && userEvent.piece[piece]) < 1) throw `Bạn không đủ mảnh ${piece} để quy đổi`
      else updateUser[`piece.${piece}`] = -1
    }

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
    milestone.gift.forEach(gift => {
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
      content: `Nhận thưởng quy đổi bộ mảnh năm mới trên Web`,
      items: giftItem
    })
    if(Object.keys(giftCurrency).length) await DB.User.updateOne({ _id: auth._id },{ $inc: giftCurrency })
    
    // History
    await DB.LimitedLunarPieceRewardHistory.create({
      user: auth._id,
      server: server,
      role: role,
      pieces: milestone.pieces
    })

    // Update User
    await DB.LimitedLunarUser.updateOne({ _id: userEvent._id }, { $inc: updateUser })

    // Send Data
    return resp(event, { message: 'Nhận thưởng thành công' }) 
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})