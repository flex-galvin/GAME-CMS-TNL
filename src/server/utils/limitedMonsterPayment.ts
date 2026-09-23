import type { Types } from 'mongoose'
import type { IDBLimitedMonster, IDBLimitedMonsterUser } from '~~/types'

export default async (user: Types.ObjectId, money: number) : Promise<boolean> => {
  try {
		let config = await DB.LimitedMonster.findOne({}).select('time blood lasthit') as IDBLimitedMonster
		if(!config) throw 'Không tìm thấy cấu hình sự kiện'
		if(!config.time.active) throw 'Sự kiện chưa khai mở'
		
		const now = dayjs(Date.now()).unix()
		const start = dayjs(config.time.start).unix()
		const end = dayjs(config.time.end).unix()
		if(now < start || now > end) throw 'Sự kiện đã kết thúc'
		if(money < config.blood.min) throw 'Chưa đạt điều kiện số tiền tối thiểu'

		// Update Blood
		const pointToDame = Math.floor((money * config.blood.share) / 100)
		await DB.LimitedMonster.updateMany({}, { $inc: { 'blood.now': pointToDame } })

		// Update Lasthit
		if(!config.lasthit.user){
			const realBlood = pointToDame + config.blood.now
			if(realBlood >= config.blood.target){
				await DB.LimitedMonster.updateMany({}, { 'lasthit.user': user })
			}
		}
		
		// Update User
		const userEvent = await DB.LimitedMonsterUser.findOne({ user: user }).select('_id') as IDBLimitedMonsterUser
		if(!userEvent) await DB.LimitedMonsterUser.create({ user: user, point: money })
		else await DB.LimitedMonsterUser.updateOne({ _id: userEvent._id }, { $inc: { point: money } })

		return true
	}
	catch(e : any){
		return false
	}
}