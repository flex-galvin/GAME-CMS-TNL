import type { IDBUser, IDBWheel, IDBItem, IAuth, IDBConfig } from "~~/types"

const currencyTypeList = ['coin', 'wheel']

const getRandomGift = (list : Array<IDBWheel>) : IDBWheel => {
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

    const body = await readBody(event)
    const { server, role, times } = body
    if(!server) throw 'Vui lòng chọn máy chủ'
    if(!role) throw 'Vui lòng chọn nhân vật'
    if(!!isNaN(parseInt(times)) || parseInt(times) < 1) throw 'Số lượt quay không hợp lệ'
    if(![1,5,10].includes(parseInt(times))) throw 'Số lượt quay không hỗ trợ'

    // Web Config
    const webConfig = await DB.Config.findOne().select('enable') as IDBConfig
    if(!webConfig) throw 'Không tìm thấy cấu hình trang'
    if(!webConfig.enable.play) throw 'Trò chơi đang bảo trì, vui lòng quay lại sau'

    // Get User
    const user = await DB.User.findOne({ _id: auth._id }).select('currency.wheel') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'
    if(user.currency.wheel < times) throw 'Bạn không đủ lượt quay'

    // List Gift
    const list = await DB.Wheel
    .find({ display: 1})
    .populate({ path: 'item' })
    .select('item amount percent')
    .sort({ updatedAt: -1 }) as Array<IDBWheel>
    if(list.length == 0) throw 'Vòng quay hiện chưa có phần thưởng để bắt đầu'

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
        const resultGift = getRandomGift(list)
        if(!resultGift) throw true

        // Check Item
        const item = await DB.Item.findOne({ _id: resultGift.item }).select('item_id type') as IDBItem
        if(!item) throw true

        if(item.type == 'game_item') sendItems.push({ 
          id: item.item_id, 
          amount: resultGift.amount 
        })

        if(!!currencyTypeList.includes(item.type)){
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
        title: 'Web Lucky Wheel',
        content: 'Vật phẩm nhận từ vòng quay may mắn trên Web',
        items: items
      })
    }
    if(Object.keys(sendCurrencys).length > 0) await DB.User.updateOne({ _id: auth._id }, { $inc: sendCurrencys })

    // History
    histories.length > 0 && await DB.WheelHistory.insertMany(histories)

    // Update User
    await DB.User.updateOne({ _id: auth._id }, { $inc: { 'currency.wheel': parseInt(spinCount) * -1 }})
    !!IO && IO.to(auth._id.toString()).emit('auth-update')

    return resp(event, { result: resultListGift })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})