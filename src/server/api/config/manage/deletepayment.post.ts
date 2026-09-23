import type { IAuth } from "~~/types"
import mongoose from "mongoose"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'config.action')

    const body = await readBody(event)
    if(!body.start || !body.end) throw 'Vui lòng nhập đầy đủ thời gian'

    const start = dayjs(body.start)
    const end = dayjs(body.end)
    if(start.unix() >= end.unix()) throw 'Thời gian không hợp lệ'

    const range = { $gte: start.toDate(), $lte: end.toDate() }
    const keep = body.keep || 0

    // Xóa các giao dịch chưa thành công
    await DB.Payment.deleteMany({ createdAt: range, status: { $ne: 1 }})

    // Lấy danh sách giao dịch thành công
    const successPayments = await DB.Payment
    .find({ createdAt: range, status: 1 })
    .select('_id money')

    // Lấy các giao dịch giữ lại
    let total = 0
    const keepIds: mongoose.Types.ObjectId[] = []
    for (const item of successPayments) {
      const next = total + (item.money || 0)
      if (next <= keep) {
        total = next
        keepIds.push(item._id)
      }
    }

    // Xóa các giao dịch dư
    await DB.Payment.deleteMany({ createdAt: range, status: 1, _id: { $nin: keepIds }})

    await logAdmin(event, 'Thao tác <bxóa nhiều giao dịch</b>')
    return resp(event, { message: 'Thực hiện thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})