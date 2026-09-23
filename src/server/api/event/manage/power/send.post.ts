import type { IAuth, IDBGameRankPowerUpProcess } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'event.edit')

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const processEvent = await DB.GameRankPowerUpProcess.findOne({ _id: _id }).select('servers send') as IDBGameRankPowerUpProcess
    if(!processEvent) throw 'Tiến trình không tồn tại'
    if(!processEvent.active) throw 'Vui lòng kích hoạt tiến trình trước'
    if(!!processEvent.send) throw 'Phần quà đã được trao'

    await rankPowerUpProcessAward(processEvent._id) 

    await logAdmin(event, `Trả quà sự kiện tăng lực chiến sớm cho máy chủ <b>${processEvent.servers.join(',')}</b>`)
    return resp(event, { message: 'Thao tác thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})