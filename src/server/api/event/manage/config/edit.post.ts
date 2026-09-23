import type { IAuth, IDBEventConfig } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'event.edit')

    const body = await readBody(event)
    const {_id, start, end } = body
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const eventConfig = await DB.EventConfig.findOne({ _id: _id }).select('name') as IDBEventConfig
    if(!eventConfig) throw 'Cấu hình sự kiện không tồn tại'

    if(!!start && !!end){
      const startUnix = dayjs(start).unix()
      const endUnix = dayjs(end).unix()
      if(startUnix > endUnix) throw 'Thời gian bắt đầu không thể lớn hơn thời gian kết thúc'
    }

    const startDate = start ? dayjs(start).startOf('day').toDate() : null
    const endDate = end ? dayjs(end).endOf('day').toDate() : null

    delete body['_id']
    const data = await DB.EventConfig.findOneAndUpdate({ _id: _id }, {
      ...body,
      start: startDate,
      end: endDate,
    }, { new: true }) as IDBEventConfig
    
    await logAdmin(event, `Sửa cấu hình sự kiện <b>${ eventConfig.name }</b>`)
    return resp(event, { message: 'Sửa thành công', result: data })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})