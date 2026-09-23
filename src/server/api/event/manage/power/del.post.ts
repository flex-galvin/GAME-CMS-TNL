import type { IAuth, IDBGameRankPowerUpProcess } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'event.del')

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const processEvent = await DB.GameRankPowerUpProcess.findOne({ _id: _id }).select('servers') as IDBGameRankPowerUpProcess
    if(!processEvent) throw 'Tiến trình không tồn tại'

    await DB.GameRankPowerUpProcess.deleteOne({ _id: processEvent._id })
    await DB.GameRankPowerUpProcessLog.deleteMany({ process: processEvent._id })
    await DB.GameRankPowerUp.deleteMany({ process: processEvent._id })

    await logAdmin(event, `Xóa tiến trình sự kiện tăng lực chiến của máy chủ <b>${processEvent.servers.join(',')}</b>`)
    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})