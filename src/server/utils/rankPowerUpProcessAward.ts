import type { IDBGameRankPowerUpProcess, IDBItem, IDBUser } from '~~/types'
import { Types } from 'mongoose'

export default async (processEventID? : Types.ObjectId) => {
  try {
    const randStart = dayjs().startOf('day').toDate()
    const randEnd = dayjs().endOf('day').toDate()

    const match : any = {
      active: true,                                 // Đã kích hoạt
      processing: false,                            // Không có tiến trình trả thưởng đang chạy
      send: false,                                  // Chưa trả thưởng
      end: { $gte: randStart, $lte : randEnd },     // 00h00 <= Kết thúc <= 23h59 (Ngày hiện tại)
      award: { $exists: true, $not: { $size: 0 } }  // Đã cài đặt quà tặng
    }
    if(!!processEventID) {
      match['_id'] = { $in: [ processEventID ]}
      delete match['end']
    }

    const listProcess = await DB.GameRankPowerUpProcess
    .find(match)
    .select('servers start end award') 
    .populate({ path: 'award.gift.item', select: 'item_id type'}) as Array<IDBGameRankPowerUpProcess>

    await Promise.allSettled(listProcess.map(async (processEvent) => {
      // Update Processing
      await DB.GameRankPowerUpProcess.updateOne({ _id: processEvent._id }, { processing: true })

      // Get Max Rank
      processEvent.award.sort((a,b) => b.rank - a.rank)
      const maxRank = processEvent.award[0].rank

      // Get Ranks
      const ranks = await DB.GameRankPowerUp.aggregate([
        { $match: {  process: new Types.ObjectId(processEvent._id) }},
        {
          $lookup: {
            from: "GameRankPowerUpProcess",
            let: { processId: "$process", createdAt: "$createdAt" },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$_id", "$$processId"] },
                      { $lte: ["$start", "$$createdAt"] },
                      { $gte: ["$end", "$$createdAt"] }
                    ]
                  }
                }
              },
              { $project: { _id: 1 } }
            ],
            as: "processData"
          }
        },
        { $match: { processData: { $ne: [] } } },
        {
          $group: {
            _id: {
              account: "$account",
              server: "$server",
              role_id: "$role_id"
            },
            maxPower: { $max: "$power" },
            minPower: { $min: "$power" },
            role_name: { $first: "$role_name" }
          }
        },
        {
          $addFields: {
            account: "$_id.account",
            server: "$_id.server",
            role_id: "$_id.role_id",
            power: { $subtract: ["$maxPower", "$minPower"] }
          }
        },
        { $sort: { power: -1 } },
        { $limit: maxRank },
        {
          $setWindowFields: {
            sortBy: { power: -1 },
            output: {
              rank: { $rank: {} }
            }
          }
        },
        { $project: { _id: 0, maxPower: 0, minPower: 0 }}
      ])

      const usernames = ranks.map((role : any) => role.account)
      const users = await DB.User.find({ username: { $in: usernames } }).select('_id username')
      const userMap = new Map(users.map(u => [u.username, u]))

      for (const role of ranks) {
        try {
          if(role.power < 1) throw `Chỉ số xếp hạng [${role.power}] không hợp lệ`

          const awardFormat = JSON.parse(JSON.stringify(processEvent.award))
          const rankAward : any = awardFormat.find((award : any) => award.rank == role.rank)
          if(!rankAward || (!!rankAward && rankAward.gift.length == 0)) throw `Phần quà cho hạng ${role.rank} chưa được thiết lập`

          const user = userMap.get(role.account) as IDBUser
          if(!user) throw `Không tìm thấy thông tin tài khoản`

          // Format Gift
          const giftItem : Array<any> = []
          const giftCurrency : any = {}
          rankAward.gift.forEach((gift : any) => {
            const item = gift.item as IDBItem
            if(!!item){
              if(item.type == 'game_item') giftItem.push({ id: item.item_id, amount: gift.amount })
              if(!!['coin', 'wheel'].includes(item.type)) giftCurrency[`currency.${item.type}`] = gift.amount
            }
          })

          // Send Gift
          if(giftItem.length > 0) await gameSendMail(null, {
            account: user.username,
            server_id: role.server,
            role_id: role.role_id,
            title: `TOP ${role.rank} - Web Power Up Event`,
            content: 'Vật phẩm nhận từ sự kiện tăng tiến lực chiến trên website',
            items: giftItem
          })
          if(Object.keys(giftCurrency).length) await DB.User.updateOne({ _id: user._id },{ $inc: giftCurrency })

          // Log Process
          await DB.GameRankPowerUpProcessLog.create({
            process: processEvent._id,
            content: `✅ Trả thưởng <b>TOP ${role.rank}</b> cho tài khoản <b>${user.username}</b> với nhân vật <b>[${role.role_id}] ${role.role_name}</b> tại máy chủ <b>${role.server}</b>`
          })

          // Log Receive
          await logUser(null, user._id, `Nhận quà sự kiện tăng lực chiến <b>TOP ${role.rank}</b> tại máy chủ <b>${role.server}</b>`)
        }
        catch(err : any){
          await DB.GameRankPowerUpProcessLog.create({ 
            process: processEvent._id, 
            content: `❌ Lỗi trả thưởng <b>TOP ${role.rank}</b> cho tài khoản <b>${role.account}</b>: ${err.toString()}` 
          })
        }
      }

      // Update Process
      await DB.GameRankPowerUpProcess.updateOne({ _id: processEvent._id }, { send: true, processing: false, active: false })
      await DB.GameRankPowerUpProcessLog.create({ process: processEvent._id, content: `Trả thưởng sự kiện thành công` })
    }))
  }
  catch (e:any) {
    console.error(`❌ Lỗi trả thưởng Tăng Lực Chiến tự động: ${e.toString()}`)
  }
}