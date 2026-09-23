import type { IAuth, IDBItem, IDBLimitedHalloween, IDBLimitedHalloweenUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { server, role, reward } = await readBody(event)
    if(!server) throw 'Vui lòng chọn máy chủ'
    if(!role) throw 'Vui lòng chọn nhân vật'
    if(!reward) throw 'Vui lòng chọn phần thưởng'

    // Check Event
    let config = await DB.LimitedHalloween.findOne({}).select('time pumpkin.reward') as IDBLimitedHalloween
    if(!config) throw 'Không tìm thấy cấu hình sự kiện Halloween'
    if(!config.time.active) throw 'Sự kiện chưa khai mở'

    const now = dayjs(Date.now()).unix()
    const start = dayjs(config.time.start).unix()
    const end = dayjs(config.time.end).unix()
    if(now < start || now > end) throw 'Sự kiện đã kết thúc'

    // Check User Event
    const userEvent = await DB.LimitedHalloweenUser.findOne({ user: auth._id }).select('pumpkin') as IDBLimitedHalloweenUser
    if(!userEvent) throw 'Vui lòng nạp tiền trong thời gian sự kiện để kích hoạt'
    if(!userEvent.pumpkin.play) throw 'Vui lòng mở bí ngô bí ẩn trước'
    if(!userEvent.pumpkin.result) throw 'Phiên chơi lỗi, vui lòng chơi lại'
    if(userEvent.pumpkin.reward.length == 0) throw 'Phiên chơi lỗi, vui lòng chơi lại'

    // Check Item
    const item = await DB.Item.findOne({ _id: reward }).select('item_id type') as IDBItem
    if(!item) throw 'Vật phẩm không tồn tại'
    const index = userEvent.pumpkin.reward.findLastIndex((i : any) => i.item.toString() == item._id.toString())
    if(index < 0) throw 'Vật phẩm không có trong danh sách quà'

    // Check Result
    let win = false
    let amount = 0
    if(userEvent.pumpkin.result.toString() == item._id.toString()){
      amount = userEvent.pumpkin.reward[index]['amount']
      const giftItem : Array<any> = []
      const giftCurrency : any = {}
      if(item.type == 'game_item') giftItem.push({ id: item.item_id, amount: amount })
      if(!!['coin', 'wheel'].includes(item.type)) giftCurrency[`currency.${item.type}`] = amount

      if(giftItem.length > 0) await gameSendMail(event, {
        account: auth.username,
        server_id: server,
        role_id: role,
        title: 'Web Limited Halloween',
        content: 'Vật phẩm nhận từ Bí Ngô Bí Ẩn trên Web',
        items: giftItem
      })
      if(Object.keys(giftCurrency).length) await DB.User.updateOne({ _id: auth._id },{ $inc: giftCurrency })
      
      win = true
    }

    // Save Log
    await DB.LimitedHalloweenPumpkinHistory.create({
      user: auth._id,
      result: userEvent.pumpkin.result,
      server: server,
      role: role,
      item: item._id,
      amount: amount,
      win: win
    })

    // Reset
    userEvent.pumpkin.play = false
    userEvent.pumpkin.reward = []
    userEvent.pumpkin.result = null
    await userEvent.save()

    // Send Data
    return resp(event, { result: !!win ? 'TRUE' : 'FAIL' }) 
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})