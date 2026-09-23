import type { IAuth, IDBLimitedHalloween, IDBLimitedHalloweenUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    let config = await DB.LimitedHalloween.findOne({}).select('time pumpkin.reward') as IDBLimitedHalloween
    if(!config) throw 'Không tìm thấy cấu hình sự kiện Halloween'
    if(!config.time.active) throw 'Sự kiện chưa khai mở'
    if(config.pumpkin.reward.length < 3) throw 'Sự kiện chưa sẵn sàng, vui lòng quay lại sau'
    
    const now = dayjs(Date.now()).unix()
    const start = dayjs(config.time.start).unix()
    const end = dayjs(config.time.end).unix()
    if(now < start || now > end) throw 'Sự kiện đã kết thúc'
    
    const userEvent = await DB.LimitedHalloweenUser.findOne({ user: auth._id }).select('candy pumpkin') as IDBLimitedHalloweenUser
    if(!userEvent) throw 'Vui lòng nạp tiền trong thời gian sự kiện để kích hoạt'
    if(!!userEvent.pumpkin.play) throw 'Vui lòng chơi hết lượt chơi cũ'
    if(userEvent.candy < 1) throw 'Bạn đã hết lượt chơi'

    const random = config.pumpkin.reward.sort(() => Math.random() - 0.5).slice(0, 3)
    const result = random[Math.floor(Math.random() * random.length)]
    userEvent.pumpkin.reward = random.map((i : any) => ({ item: i.item, amount: i.amount }))
    userEvent.pumpkin.result = result.item
    userEvent.pumpkin.play = true
    userEvent.candy = userEvent.candy - 1
    
    await userEvent.save()
    return resp(event, { result: config })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})