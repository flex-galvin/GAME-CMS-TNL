import type { IAuth, IDBLevel } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'level.edit')

    const body = await readBody(event)
    const { _id, bonus, discount } = body
    if(
      !_id
      || !!isNaN(parseInt(bonus))
      || !!isNaN(parseInt(discount))
      || parseInt(bonus) < 0 
      || parseInt(discount) < 0
    ) throw 'Dữ liệu đầu vào không hợp lệ'
    
    const level = await DB.Level.findOne({ _id: _id }).select('_id number') as IDBLevel
    if(!level) throw 'Cấp độ không tồn tại'

    delete body['_id']
    await DB.Level.updateOne({ _id: _id }, body)

    await logAdmin(event, `Sửa thông tin cấp độ <b>${level.number}</b>`)
    return resp(event, { message: 'Sửa cấp độ thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})