import type { Types } from 'mongoose'
import type { IDBLimitedChristmas, IDBLimitedChristmasUser } from '~~/types'

export default async (user: Types.ObjectId, money: number) : Promise<boolean> => {
  try {
		let config = await DB.LimitedChristmas.findOne({}).select('time jar box') as IDBLimitedChristmas
		if(!config) throw 'Không tìm thấy cấu hình sự kiện'
		if(!config.time.active) throw 'Sự kiện chưa khai mở'
		
		const now = dayjs(Date.now()).unix()
		const start = dayjs(config.time.start).unix()
		const end = dayjs(config.time.end).unix()
		if(now < start || now > end) throw 'Sự kiện đã kết thúc'
		if(money < config.jar.min) throw 'Chưa đạt điều kiện số tiền tối thiểu'

		// Update Jar
		const pointToJar = Math.floor((money * config.jar.share) / 100)
		const starToUser = Math.floor(money / config.box.share)
		await DB.LimitedChristmas.updateMany({}, { $inc: { 'jar.now': pointToJar } })
		
		// Update User
		const userEvent = await DB.LimitedChristmasUser.findOne({ user: user }).select('_id') as IDBLimitedChristmasUser
		if(!userEvent) await DB.LimitedChristmasUser.create({ user: user, point: money, star: starToUser })
		else await DB.LimitedChristmasUser.updateOne({ _id: userEvent._id }, { $inc: { point: money, star: starToUser } })

		return true
	}
	catch(e : any){
		return false
	}
}