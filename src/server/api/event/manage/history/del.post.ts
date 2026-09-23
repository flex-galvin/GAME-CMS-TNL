import type { IAuth, IDBEvent } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'event.delHistory')

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const histories = await DB.EventHistory.findOne({ _id: _id }) as IDBEvent
    if(!histories) throw 'Dữ liệu lịch sử không tồn tại'

    await DB.EventHistory.deleteOne({ _id: _id })
    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})