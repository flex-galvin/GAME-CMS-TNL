import type { IAuth, IDBSpend } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'spend.del')

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const spend = await DB.Spend.findOne({ _id: _id }).select('title') as IDBSpend
    if(!spend) throw 'Mục chi tiêu không tồn tại'
    
    await DB.Spend.deleteOne({ _id: _id })
    await logAdmin(event, `Xóa mục chi tiêu <b>${spend.title}</b>`)

    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})