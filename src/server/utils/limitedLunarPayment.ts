import type { Types } from 'mongoose'
import type { IDBLimitedLunar, IDBLimitedLunarUser } from '~~/types'

export default async (user: Types.ObjectId, money: number) : Promise<boolean> => {
  try {
		let config = await DB.LimitedLunar.findOne({}).select('time jar redbag') as IDBLimitedLunar
		if(!config) throw 'Không tìm thấy cấu hình sự kiện'
		if(!config.time.active) throw 'Sự kiện chưa khai mở'
		
		const now = dayjs(Date.now()).unix()
		const start = dayjs(config.time.start).unix()
		const end = dayjs(config.time.end).unix()
		if(now < start || now > end) throw 'Sự kiện đã kết thúc'
		if(money < config.jar.min) throw 'Chưa đạt điều kiện số tiền tối thiểu'

		// Update Jar
		const pointToJar = Math.floor((money * config.jar.share) / 100)
		const redbagToUser = Math.floor(money / config.redbag.share)
		await DB.LimitedLunar.updateMany({}, { $inc: { 'jar.now': pointToJar } })

		// Update User
		const userEvent = await DB.LimitedLunarUser.findOne({ user: user }).select('_id') as IDBLimitedLunarUser
		if(!userEvent) await DB.LimitedLunarUser.create({ 'user': user, 'point': money, 'redbag.count': redbagToUser })
		else await DB.LimitedLunarUser.updateOne({ _id: userEvent._id }, { $inc: { 'point': money, 'redbag.count': redbagToUser } })

		return true
	}
	catch(e : any){
		console.log('Lunar Payment Error', user, e.toString())
		return false
	}
}