import type { IAuth, IDBItem, IDBLimitedLunar, IDBLimitedLunarUser } from "~~/types"

interface IBoxGift {
  item: IDBItem
  amount: number
  percent: number
}

const getRamdomHasPiece = (percent : number) => {
  if (percent <= 0) return false
  if (percent >= 100) return true
  return Math.random() * 100 < percent
}

const getRandomPiece = (percentObj : { A: number, B: number, C: number, D: number }) => {
  const entries = Object.entries(percentObj).filter(([, p]) => p > 0) // bỏ tỷ lệ 0
  const total = entries.reduce((sum, [, p]) => sum + p, 0)
  if (total <= 0) return null // không có mảnh nào hợp lệ

  let r = Math.random() * total
  for (const [key, p] of entries) {
    r -= p
    if (r < 0) return key
  }
  return entries[entries.length - 1][0] 
}

const getRandomGift = (list : Array<IBoxGift>) : IBoxGift => {
  // Get Random
  let totalPercent = 0
  let rand = 0

  totalPercent = list.reduce((accumulator, object) => {
    return parseFloat(String(accumulator)) + parseFloat(String(object.percent))
  }, 0)
  totalPercent = totalPercent
  rand = Math.random() * totalPercent

  // Get Chances
  const chances : Array<number> = []
  let acc = 0
  list.forEach(i => {
    acc = parseFloat(String(acc)) + (parseFloat(String(i.percent)))
    chances.push(acc)
  })

  // Get Index
  let index : number = 0
  chances.forEach(i => {
    if(i <= rand){
      index = index + 1
    }
  })

  return list[index]
}

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { server, role, times } = await readBody(event)
    if(!server) throw 'Vui lòng chọn máy chủ'
    if(!role) throw 'Vui lòng chọn nhân vật'
    if(![1,5,10].includes(parseInt(times))) throw 'Số lượng hộp mở không hỗ trợ'

    // Check Config
    let config = await DB.LimitedLunar.findOne({})
    .select('time redbag bonus piece.percent') 
    .populate({ path: 'redbag.random.item', select: 'item_id item_name item_image type' })as IDBLimitedLunar
    if(!config) throw 'Không tìm thấy cấu hình sự kiện'
    
    // Check Time
    if(!config.time.active) throw 'Sự kiện chưa khai mở'
    const now = dayjs(Date.now()).unix()
    const start = dayjs(config.time.start).unix()
    const end = dayjs(config.time.end).unix()
    if(now < start || now > end) throw 'Sự kiện đã kết thúc'

    // Check Reward 
    if(config.redbag.random.length == 0) throw 'Sự kiện chưa sẵn sàng, vui lòng quay lại sau'
    
    // Check User Event
    const userEvent = await DB.LimitedLunarUser.findOne({ user: auth._id }).select('redbag') as IDBLimitedLunarUser
    if(!userEvent) throw 'Vui lòng nạp tiền trong thời gian sự kiện để kích hoạt'
    if(userEvent.redbag.count < 1) throw 'Bạn đã hết bao lì xì'
    if(userEvent.redbag.count < times) throw 'Lượt mở lì xì không đủ'

    // Make Bonus
    let bonus : number = 1
    if(!!config.bonus.enable.eve && !!config.bonus.start && !!config.bonus.end){
      const startBonus = dayjs(config.bonus.start).unix()
      const endBonus = dayjs(config.bonus.end).unix()
      if(startBonus <= now && now <= endBonus) bonus = config.bonus.value > 1 ? config.bonus.value : 1
    }

    // Make Send Item
    const resultListGift : any[] = []
    const sendItems : any[] = []
    const sendCurrencys : any = {}
    const historiesRedbag : any[] = []
    const pieces : any = {}
    const historiesPieces : any[] = []
    let spinCount = times

    const arr = Array.from({ length: times }, (_, i) => i)
    await Promise.allSettled(arr.map(async (i) => {
      try {
        // Get Random Gift
        const resultGift = getRandomGift(config.redbag.random)
        if(!resultGift) throw true
        const amount = Math.floor(resultGift.amount * bonus)

        // Check Item
        const item = await DB.Item.findOne({ _id: resultGift.item }).select('item_id type') as IDBItem
        if(!item) throw true

        if(item.type == 'game_item') sendItems.push({ 
          id: item.item_id, 
          amount: amount
        })

        if(!!['coin', 'wheel'].includes(item.type)){
          sendCurrencys[`currency.${item.type}`] = (sendCurrencys[`currency.${item.type}`] || 0) + amount
        }

        resultListGift.push(resultGift)
        historiesRedbag.push({
          user: auth._id,
          server: server,
          role: role,
          item: item._id,
          amount: amount,
          percent: resultGift.percent
        })

        // Check Piece
        const hasPiece = getRamdomHasPiece(config.redbag.piece)
        if(hasPiece){
          const piece = getRandomPiece(config.piece.percent)
          if(piece){
            pieces[piece] = (pieces[piece] || 0) + 1
            historiesPieces.push({
              user: auth._id,
              piece: piece
            })
          }
        }
      }
      catch(e){
        spinCount--
      }
    }))

    // Send
    if(sendItems.length > 0) {
      const items : any[] = Object.values(
        sendItems.reduce((acc, { id, amount }) => {
          acc[id] = acc[id] || { id, amount: 0 };
          acc[id].amount += amount;
          return acc;
        }, {})
      )

      await gameSendMail(event, {
        account: auth.username,
        server_id: server,
        role_id: role,
        title: 'Web Limited Lunar',
        content: 'Vật phẩm nhận từ mở lì xì năm mới trên Web',
        items: items
      })
    }
    if(Object.keys(sendCurrencys).length > 0) await DB.User.updateOne({ _id: auth._id }, { $inc: sendCurrencys })

    // History Redbag
    historiesRedbag.length > 0 && await DB.LimitedLunarRedbagHistory.insertMany(historiesRedbag)

    // History Piece
    historiesPieces.length > 0 && await DB.LimitedLunarPieceHistory.insertMany(historiesPieces)

    // Update User
    await DB.LimitedLunarUser.updateOne({ _id: userEvent._id }, { $inc: { 
      'redbag.count': parseInt(spinCount) * -1,
      'redbag.use': parseInt(spinCount),
      'piece.A': parseInt(pieces['A'] || 0),
      'piece.B': parseInt(pieces['B'] || 0),
      'piece.C': parseInt(pieces['C'] || 0),
      'piece.D': parseInt(pieces['D'] || 0),
    }})
    
    return resp(event, { result: { 
      gifts: resultListGift,
      pieces: pieces
    }})
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})