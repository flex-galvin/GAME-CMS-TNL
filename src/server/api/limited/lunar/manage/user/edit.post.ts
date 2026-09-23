import type { IAuth, IDBLimitedLunarUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'limited.update')

    const body = await readBody(event)
    const { _id, point, redbag } = body
    if(!_id || !redbag) throw 'Dữ liệu đầu vào không hợp lệ'
    const { count } = redbag
    if(
      !!isNaN(parseInt(count)) 
      || parseInt(count) < 0
    ) throw 'Số bao lì xì phải lớn hơn 0'
    if(
      !!isNaN(parseInt(point)) 
      || parseInt(point) < 0
    ) throw 'Số điểm nạp phải lớn hơn 0'

    const user = await DB.LimitedLunarUser.findOne({ _id: _id }) as IDBLimitedLunarUser
    if(!user) throw 'Người chơi không tồn tại'

    user.point = point
    user.redbag.count = count
    await user.save()

    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})