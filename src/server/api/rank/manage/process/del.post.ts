import type { IAuth, IDBGameRankProcess } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'event.del')

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const processEvent = await DB.GameRankProcess.findOne({ _id: _id }).select('server type') as IDBGameRankProcess
    if(!processEvent) throw 'Tiến trình không tồn tại'

    await DB.GameRankProcess.deleteOne({ _id: processEvent._id })
    await DB.GameRankProcessLog.deleteMany({ process: processEvent._id })

    await logAdmin(event, `Xóa tiến trình trả quà đua <b>TOP ${processEvent.type == 'power' ? 'lực chiến' : 'cấp độ'}</b> của máy chủ <b>${processEvent.server}</b>`)
    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})