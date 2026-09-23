import type { IDBConfig, IDBGameRankPowerUpProcess } from '~~/types'
import axios from 'axios'
import { Types } from 'mongoose'

export default async (processEventID? : Types.ObjectId) => {
  try {
    // Get Config
    const config = await DB.Config.findOne().select('game') as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình trò chơi'
    if(!config.game.api.roles) throw 'Tính năng xem bảng xếp hạng lực chiến đang bảo trì'

    const now = dayjs().toDate()

    const match : any = {
      active: true,                         // Đã kích hoạt
      send: false,                          // Chưa trả thưởng
      processing: false,                    // Không có tiến trình trả thưởng đang chạy
      start: { $lte : now },                // start <= now  → Đã bắt đầu
      end: { $gte: now }                    // end >= now    → Chưa kết thúc
    }
    if(!!processEventID) match['_id'] = { $in: [ processEventID ]}

    const listProcess = await DB.GameRankPowerUpProcess.find(match).select('servers') as Array<IDBGameRankPowerUpProcess>

    await Promise.allSettled(listProcess.map(async (processEvent) => {
      for (const server of processEvent.servers) {
        try {
          const send = await axios.post(config.game.api.roles, {
            secret: config.game.secret,
            server_id: server,
            size: 1000, 
            current: 1,
            sort: { column: 'power', direction: 'desc' },
            search: {  key: null, by: 'USER' },
          },{
            timeout: 10_000
          })
          const res = send.data
          if(!!res.error) throw res.error
          if(!res.data) throw 'Không lấy được dữ liệu từ trò chơi'
          if(!res.data.list) throw 'Không lấy được danh sách xếp hạng từ trò chơi'

          const fullList = res.data.list as Array<any>
          const filteredList = fullList.filter(i => i.power > 100000 && !!i.account)

          const usernames = [...new Set(filteredList.map(i => i.account))]
          const existUsers = await DB.User.find({ username: { $in: usernames } }).select('username')
          const validAccounts = new Set(existUsers.map(u => u.username))
          const validList = filteredList.filter(i => validAccounts.has(i.account))

          // Lấy last power
          const matchLast : any = { process: processEvent._id }
          const keys = validList.map(i => ({ account: i.account, role_id: i.role_id }))
          if(keys.length > 0) matchLast['$or'] = keys.map(k => ({ account: k.account, role_id: k.role_id }))
          const lastRecords = await DB.GameRankPowerUp.find(matchLast).sort({ _id: -1 })

          const lastMap = new Map<string, number>()
          for (const rec of lastRecords) {
            const key = `${rec.account}_${rec.role_id}`
            if (!lastMap.has(key)) lastMap.set(key, rec.power)
          }

          // Filter thay đổi power
          const dataToInsert = validList
          .filter(item => lastMap.get(`${item.account}_${item.role_id}`) !== item.power)
          .map(item => ({
            process: processEvent._id,
            server: server,
            account: item.account,
            role_name: item.role_name,
            role_id: item.role_id,
            power: parseInt(item.power)
          }))

          if (dataToInsert.length > 0) {
            await DB.GameRankPowerUp.insertMany(dataToInsert, { ordered: false })
          }

          await DB.GameRankPowerUpProcessLog.create({
            process: processEvent._id,
            content: `✅ Ghi dữ liệu lực chiến nhân vật của máy chủ ${server}`
          })
        }
        catch (err: any) {
          await DB.GameRankPowerUpProcessLog.create({
            process: processEvent._id,
            content: `❌ Lỗi ghi dữ liệu cho máy chủ ${server}: ${axios.isAxiosError(err) && err.code === 'ECONNABORTED' ? 'Quá thời gian gọi API cho phép' : err.toString()}`
          })
        }
      }
    }))
  }
  catch (e:any) {
    console.error(`❌ Lỗi ghi dữ liệu Tăng Lực Chiến tự động: ${e.toString()}`)
  }
}