import type { IAuth, IDBGameRankProcess } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'event.edit')

    const body = await readBody(event)
    const { _id, server, end, active } = body
    if(!_id || !server || !end) throw 'Dữ liệu đầu vào không hợp lệ'

    const processEvent = await DB.GameRankProcess.findOne({ _id: _id }).select('server send type') as IDBGameRankProcess
    if(!processEvent) throw 'Tiến trình không tồn tại'

    if(processEvent.server != server){
      const getByServer = await DB.GameRankProcess.findOne({ server: server, type: processEvent.type }).select('_id') as IDBGameRankProcess
      if(!!getByServer) throw 'Tiến trình cho máy chủ này đã tồn tại'
    }

    if(!!active) {
      if(!!processEvent.send) throw 'Không thể kích hoạt khi hệ thống đã trả thưởng'
      const endOfToday = dayjs().endOf('day').unix()
      const endOfEvent = dayjs(end).endOf('day').unix()
      if(endOfToday > endOfEvent) throw 'Không thể kích hoạt khi thời gian kết thúc là quá khứ'
    }

    delete body['_id']
    await DB.GameRankProcess.updateOne({ _id: processEvent._id }, {
      ...body,
      end: dayjs(end).hour(23).minute(0).second(0).millisecond(0).toDate(),
    })

    await logAdmin(event, `Sửa tiến trình trả quà đua <b>TOP ${processEvent.type == 'power' ? 'lực chiến' : 'cấp độ'}</b> của máy chủ <b>${processEvent.server}</b>`)
    return resp(event, { message: 'Sửa thành công' })
  }
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})