import type { Types } from 'mongoose'
import type { IDBLimitedPay, IDBLimitedPayUser } from '~~/types'

export default async (user: Types.ObjectId, money: number, bonusSavePay : number = 0) : Promise<boolean> => {
  try {
		let config = await DB.LimitedPay.findOne({}).select('time') as IDBLimitedPay
		if(!config) throw 'Không tìm thấy cấu hình sự kiện'
		if(!config.time.active) throw 'Sự kiện chưa khai mở'
		
		const now = dayjs(Date.now()).unix()
		const start = dayjs(config.time.start).unix()
		const end = dayjs(config.time.end).unix()
		if(now < start || now > end) throw 'Sự kiện đã kết thúc'

		// Update User
		const add = money + bonusSavePay
		const userEvent = await DB.LimitedPayUser.findOne({ user: user }).select('_id') as IDBLimitedPayUser
		if(!userEvent) await DB.LimitedPayUser.create({ user: user, money: add })
		else await DB.LimitedPayUser.updateOne({ _id: userEvent._id }, { $inc: { money: add } })

		return true
	}
	catch(e : any){
		return false
	}
}