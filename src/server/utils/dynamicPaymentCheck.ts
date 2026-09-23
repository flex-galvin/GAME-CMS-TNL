import axios from 'axios'
import { Types } from 'mongoose'
import { IDBGate, IDBPayment } from '~~/types'

export default async (_id : Types.ObjectId) : Promise<string> => {
  try {
    if(!_id) throw 'Không tìm thấy ID giao dịch'
    const payment = await DB.Payment.findOne({ _id: _id }).select('gate channel code') as IDBPayment
    if(!payment) throw 'Giao dịch không tồn tại'
    if(!payment.channel) throw 'Giao dịch không hỗ trợ'
    if(!payment.channel.id) throw 'Giao dịch không hỗ trợ'

    const gate = await DB.Gate.findOne({ _id: payment.gate }).select('dynamic') as IDBGate
    if(!gate) throw 'Không tìm thấy thông tin kênh nạp'
    if(!gate.dynamic) throw 'Kênh nạp không hỗ trợ'
    if(!gate.dynamic.key || !gate.dynamic.check) throw 'Vui lòng cập nhật đầy đủ API Callback Key và API URL Check Payment'

    const params = {
      apiKey: gate.dynamic.key,
      cashId: payment.channel.id,
      chargeId: payment.code
    }
    const url = gate.dynamic.check
    const body = new URLSearchParams(params).toString()
    const send = await axios.get(`${url}?${body}`,{
      timeout: 10_000
    })
    const res = send.data
    if(!res) throw 'API đang gặp sự cố, vui lòng thử lại'
    return `Trạng thái duyệt tự động: ${res.status} - ${res.message}`
  }
  catch(e : any){
    if (axios.isAxiosError(e) && e.code === 'ECONNABORTED') {
      throw 'Quá thời gian gọi API cho phép'
    }
    throw e.toString()
  }
}