import type { IAuth, IDBGameRankPowerUpProcess } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'event.add')

    const body = await readBody(event)
    const { name, start, end, servers, active } = body
    if(!name || !start || !end) throw 'Dữ liệu đầu vào không hợp lệ'

    const startDate = dayjs(start)
    const endDate = dayjs(end)
    if(startDate.unix() > endDate.unix()) throw 'Thời gian bắt đầu không thể lớn hơn thời gian kết thúc'

    if(!!active) {
      const today = dayjs()
      const endOfToday = today.endOf('day').unix()
      const endOfEvent = endDate.endOf('day').unix()
      if(endOfToday > endOfEvent) throw 'Không thể kích hoạt khi thời gian kết thúc là quá khứ'
    }

    const processEvent = await DB.GameRankPowerUpProcess.create({
      ...body,
      start: startDate.startOf('day').toDate(),
      end: endDate.hour(23).minute(45).second(0).millisecond(0).toDate(),
    }) as IDBGameRankPowerUpProcess

    if(!!active) await rankPowerUpProcessWrite(processEvent._id)

    await logAdmin(event, `Tạo tiến trình sự kiện tăng lực chiến cho máy chủ <b>${servers.join(',')}</b>`)
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})