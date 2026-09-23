import type { Types } from 'mongoose'
import type { IDBLimitedHalloween, IDBLimitedHalloweenUser } from '~~/types'

export default async (user: Types.ObjectId, money: number) : Promise<boolean> => {
  try {
		let config = await DB.LimitedHalloween.findOne({}).select('time jar pumpkin') as IDBLimitedHalloween
		if(!config) throw 'Không tìm thấy cấu hình sự kiện'
		if(!config.time.active) throw 'Sự kiện chưa khai mở'
		
		const now = dayjs(Date.now()).unix()
		const start = dayjs(config.time.start).unix()
		const end = dayjs(config.time.end).unix()
		if(now < start || now > end) throw 'Sự kiện đã kết thúc'
		if(money < config.jar.min) throw 'Chưa đạt điều kiện số tiền tối thiểu'

		// Update Jar
		const pointToJar = Math.floor((money * config.jar.share) / 100)
		const candyToUser = Math.floor(money / config.pumpkin.share)
		await DB.LimitedHalloween.updateMany({}, { $inc: { 'jar.now': pointToJar } })
		
		// Update User
		const userEvent = await DB.LimitedHalloweenUser.findOne({ user: user }).select('_id') as IDBLimitedHalloweenUser
		if(!userEvent) await DB.LimitedHalloweenUser.create({ user: user, point: money, candy: candyToUser })
		else await DB.LimitedHalloweenUser.updateOne({ _id: userEvent._id }, { $inc: { point: money, candy: candyToUser } })

		return true
	}
	catch(e : any){
		return false
	}
}