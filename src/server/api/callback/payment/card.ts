import type { IDBPayment } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { status, request_id, card_value } = query
    if(!status || !request_id || !card_value) throw 'Không có quyền quy cập'
    if(status == 99) throw 'Thẻ chờ xử lý'

    const order = (request_id as string).split('-')
    const code = order[0]
    const token = order[1]
    if(!code || !token) throw 'Biến sai cú pháp'

    const payment = await DB.Payment.findOne({ token: token, code: code }).select('auto') as IDBPayment
    if(!payment) throw 'Giao dịch không tồn tại'

    const realStatus = (status != 1 && status != 2) ? 2 : ((!card_value || card_value == 0) ? 2 : 1) // 1 Success, 2 Refuse
		const money = Number(card_value)

    payment.auto = true
    await payment.save()
    await verifyPayment(event, {
      _id: payment._id,
      status: realStatus,
      money: money,
      reason: 'Thẻ không hợp lệ'
    })

    resp(event, { message: 'Xử lý thành công' })
  } 
  catch (e:any) {
    setResponseStatus(event, 500)
    return {
      message: e.toString()
    }
  }
})