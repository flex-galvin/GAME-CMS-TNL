import type { IAuth, IDBLevel } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'level.edit')

    const { _id, need } = await readBody(event)
    if(!_id || !need) throw 'Dữ liệu đầu vào không hợp lệ'

    const { login, pay, spend } = need
    if(
      !!isNaN(parseInt(login)) 
      || parseInt(login) < 0 
      || !pay 
      || !spend
    ) throw 'Dữ liệu đầu vào không hợp lệ'
    if(
      !!isNaN(parseInt(pay.money)) 
      || parseInt(pay.money) < 0
    ) throw 'Dữ liệu đầu vào không hợp lệ'
    if(
      !!isNaN(parseInt(spend.coin)) 
      || parseInt(spend.coin) < 0
    ) throw 'Dữ liệu đầu vào không hợp lệ'

    const level = await DB.Level.findOne({ _id: _id }).select('_id number') as IDBLevel
    if(!level) throw 'Cấp độ không tồn tại'
    if(level.number == 1) throw 'Không thể sửa yêu cầu cấp độ 1'

    await DB.Level.updateOne({ _id: _id },{ need: need })

    await logAdmin(event, `Sửa yêu cầu cấp độ <b>${level.number}</b>`)
    return resp(event, { message: 'Sửa yêu cầu thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})