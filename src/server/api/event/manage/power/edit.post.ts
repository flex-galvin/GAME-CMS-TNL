import type { IAuth, IDBGameRankPowerUpProcess } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'event.edit')

    const body = await readBody(event)
    const { _id, servers, name, start, end, active } = body
    if(!_id || !servers || !name || !start || !end) throw 'Dữ liệu đầu vào không hợp lệ'

    const today = dayjs()
    const startDate = dayjs(start)
    const endDate = dayjs(end)
    if(startDate.unix() > endDate.unix()) throw 'Thời gian bắt đầu không thể lớn hơn thời gian kết thúc'

    const processEvent = await DB.GameRankPowerUpProcess.findOne({ _id: _id }).select('servers active send end') as IDBGameRankPowerUpProcess
    if(!processEvent) throw 'Tiến trình không tồn tại'

    if(!!active) {
      if(!!processEvent.send) throw 'Không thể kích hoạt khi hệ thống đã trả thưởng'
      const endOfToday = today.endOf('day').unix()
      const endOfEvent = endDate.endOf('day').unix()
      if(endOfToday > endOfEvent) throw 'Không thể kích hoạt khi thời gian kết thúc là quá khứ'
    }

    delete body['_id']
    await DB.GameRankPowerUpProcess.updateOne({ _id: processEvent._id }, {
      ...body,
      start: startDate.startOf('day').toDate(),
      end: endDate.hour(23).minute(45).second(0).millisecond(0).toDate(),
    })

    if(!!active) await rankPowerUpProcessWrite(processEvent._id)

    await logAdmin(event, `Sửa tiến trình sự kiện tăng lực chiến của máy chủ <b>${processEvent.servers.join(',')}</b>`)
    return resp(event, { message: 'Sửa thành công' })
  }
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})