import { createHash } from 'crypto'
import type { IDBGate, IDBPayment } from "~~/types"
import type { MultiPartData } from "h3"

const createSignature = (str : string) => {
  return createHash('sha256').update(str).digest('hex')
}

export default defineEventHandler(async (event) => {
  try {
    // apiKey : apiKey
    // cashId : Id gd nạp khởi tạo từ Cashin
    // chargeId : chargeId từ Cashin
    // userAmount : Số tiền khai báo của user ở Cashin
    // transferAmount : Số tiền thực chuyển
    // transferCode : nội dung chuyển khoản
    // sign : hash(‘sha256’, ‘cashId + chargeId + transferCode + sign_key’)

    const body = await readBody(event)
    const { apiKey, cashId, chargeId, transferAmount, transferCode, sign } = body
    if(!apiKey || !cashId || !chargeId || !transferAmount || !transferCode || !sign) throw 'Không có quyền quy cập'

    // Check Payment
    const payment = await DB.Payment.findOne({ code: chargeId }).select('gate channel auto') as IDBPayment
    if(!payment) throw 'Giao dịch không tồn tại'
    if(!payment.channel) throw 'Không tìm thấy dữ liệu giao dịch'
    if(payment.channel.id != cashId) throw 'ID giao dịch không chính xác'
    if(payment.channel.content != transferCode) throw 'Nội dung chuyển khoản không chính xác'

    // Check Gate
    const gate = await DB.Gate.findOne({ _id: payment.gate }).select('dynamic') as IDBGate
    if(!gate) throw 'Không tìm thấy kênh nạp'
    if(!gate.dynamic) throw 'Kênh nạp không hỗ trợ duyệt tự động'
    if(!gate.dynamic.key) throw 'Không tìm thấy API Callback Key của kênh nạp'
    if(!gate.dynamic.sign) throw 'Không tìm thấy Sign Code của kênh nạp'

    // Check API Callback Key
    if(gate.dynamic.key != apiKey) throw 'API Callback Key không chính xác'

    // Check Sign
    const signCheck = createSignature(cashId+''+chargeId+''+transferCode+''+gate.dynamic.sign)
    if(signCheck != sign) throw 'Mã xác thực không chính xác'
    
    // Save Auto
    payment.auto = true
    await payment.save()

    // Verify
    await verifyPayment(event, {
      _id: payment._id,
      status: 1,
      money: Number(transferAmount),
      reason: 'Không thể xác thực giao dịch'
    })

    resp(event, { message: 'Xử lý thành công' })
  } 
  catch (e:any) {
    setResponseStatus(event, 500)
    return { message: e.toString(), code: 500 }
  }
})
