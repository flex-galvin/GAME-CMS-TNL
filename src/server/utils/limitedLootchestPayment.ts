import type { Types } from 'mongoose'
import type { IDBLimitedLootChest } from '~~/types'

const getNeed = (x : number) => {
  if (x <= 90000) return 100000
  if (x <= 900000) return x + 100000
  return x + 1000000
}

export default async (user: Types.ObjectId, money: number) : Promise<boolean> => {
  try {
    let config = await DB.LimitedLootChest.findOne({}).select('time money receive') as IDBLimitedLootChest
    if(!config) throw 'Không tìm thấy cấu hình sự kiện'
    if(!config.time.active) throw 'Sự kiện chưa khai mở'
    
    const now = dayjs(Date.now()).unix()
    const start = dayjs(config.time.start).unix()
    const end = dayjs(config.time.end).unix()
    if(now < start || now > end) throw 'Sự kiện đã kết thúc'
    if(money < config.money.min) throw 'Chưa đạt điều kiện số tiền tối thiểu'
    if(!!config.receive.status) throw 'Người cướp rương đã nhận thưởng'
    
    // Update Now
    if(money >= config.money.need) await DB.LimitedLootChest.updateMany({}, { $set: {
      'money.now': money,
      'money.need': getNeed(money),
      'owner': user
    }})

    return true
  }
  catch(e : any){
		return false
	}
}