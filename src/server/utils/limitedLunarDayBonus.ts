import type { Types } from 'mongoose'
import type { IDBLimitedLunar, IDBLimitedLunarUser } from '~~/types'

export default async (user: Types.ObjectId) : Promise<boolean> => {
  try {
    let config = await DB.LimitedLunar.findOne({}).select('time redbag') as IDBLimitedLunar
    if(!config) throw 'Không tìm thấy cấu hình sự kiện'
    if(!config.time.active) throw 'Sự kiện chưa khai mở'
    
    const now = dayjs(Date.now()).unix()
    const start = dayjs(config.time.start).unix()
    const end = dayjs(config.time.end).unix()
    if(now < start || now > end) throw 'Sự kiện đã kết thúc'

    // Update Jar
    const redbagToUser = config.redbag.day
    const userEvent = await DB.LimitedLunarUser.findOne({ user: user }).select('_id') as IDBLimitedLunarUser
    if(!userEvent) await DB.LimitedLunarUser.create({ 'user': user, 'redbag.count': redbagToUser })
    else await DB.LimitedLunarUser.updateOne({ _id: userEvent._id }, { $inc: { 'redbag.count': redbagToUser } })

    return true
  }
  catch(e : any){
		return false
	}
}