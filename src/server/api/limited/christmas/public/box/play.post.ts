import type { IAuth, IDBItem, IDBLimitedChristmas, IDBLimitedChristmasUser } from "~~/types"

interface IBoxGift {
  item: IDBItem
  amount: number
  percent: number
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
    let config = await DB.LimitedChristmas.findOne({})
    .select('time box') 
    .populate({ path: 'box.random.item', select: 'item_id item_name item_image type' })as IDBLimitedChristmas
    if(!config) throw 'Không tìm thấy cấu hình sự kiện'
    
    // Check Time
    if(!config.time.active) throw 'Sự kiện chưa khai mở'
    const now = dayjs(Date.now()).unix()
    const start = dayjs(config.time.start).unix()
    const end = dayjs(config.time.end).unix()
    if(now < start || now > end) throw 'Sự kiện đã kết thúc'

    // Check Reward 
    if(config.box.random.length == 0) throw 'Sự kiện chưa sẵn sàng, vui lòng quay lại sau'
    
    // Check User Event
    const userEvent = await DB.LimitedChristmasUser.findOne({ user: auth._id }).select('star box') as IDBLimitedChristmasUser
    if(!userEvent) throw 'Vui lòng nạp tiền trong thời gian sự kiện để kích hoạt'
    if(userEvent.star < 1) throw 'Bạn đã hết lượt mở quà'
    if(userEvent.star < times) throw 'Lượt mở quà không đủ'

    // Make Send Item
    const resultListGift : any[] = []
    const sendItems : any[] = []
    const sendCurrencys : any = {}
    const histories : any[] = []
    let spinCount = times

    const arr = Array.from({ length: times }, (_, i) => i)
    await Promise.allSettled(arr.map(async (i) => {
      try {
        // Get Random Gift
        const resultGift = getRandomGift(config.box.random)
        if(!resultGift) throw true

        // Check Item
        const item = await DB.Item.findOne({ _id: resultGift.item }).select('item_id type') as IDBItem
        if(!item) throw true

        if(item.type == 'game_item') sendItems.push({ 
          id: item.item_id, 
          amount: resultGift.amount 
        })

        if(!!['coin', 'wheel'].includes(item.type)){
          sendCurrencys[`currency.${item.type}`] = (sendCurrencys[`currency.${item.type}`] || 0) + resultGift.amount 
        }

        resultListGift.push(resultGift)
        histories.push({
          user: auth._id,
          server: server,
          role: role,
          item: item._id,
          amount: resultGift.amount,
          percent: resultGift.percent
        })
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
        title: 'Web Limited Christmas',
        content: 'Vật phẩm nhận từ mở hộp quà giáng sinh trên Web',
        items: items
      })
    }
    if(Object.keys(sendCurrencys).length > 0) await DB.User.updateOne({ _id: auth._id }, { $inc: sendCurrencys })

    // History
    histories.length > 0 && await DB.LimitedChristmasBoxHistory.insertMany(histories)

    // Update User
    await DB.LimitedChristmasUser.updateOne({ _id: userEvent._id }, { $inc: { 
      'star': parseInt(times) * -1,
      'box': parseInt(times)
    }})
    
    return resp(event, { result: resultListGift })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})