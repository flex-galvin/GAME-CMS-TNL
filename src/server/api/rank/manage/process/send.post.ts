import type { IAuth, IDBGameRankProcess } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'event.edit')

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const processEvent = await DB.GameRankProcess.findOne({ _id: _id }).select('server type active send') as IDBGameRankProcess
    if(!processEvent) throw 'Tiến trình không tồn tại'
    if(!processEvent.active) throw 'Vui lòng kích hoạt tiến trình trước'
    if(!!processEvent.send) throw 'Phần quà đã được trao'

    await rankProcessAward(processEvent.server) 

    await logAdmin(event, `Trả quà đua <b>TOP ${processEvent.type == 'power' ? 'lực chiến' : 'cấp độ'}</b> sớm cho máy chủ <b>${processEvent.server}</b>`)
    return resp(event, { message: 'Thao tác thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})