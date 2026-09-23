import type { H3Event } from 'h3'
import axios from 'axios'
import { createHash } from 'crypto'
import { IDBGate } from '~~/types'

const typeFormat : any = {
  1: 'CARD',
  2: 'BANK',
  3: 'MOMO'
}

const createSignature = (str : string) => {
  return createHash('sha256').update(str).digest('hex')
}

export default async (event : H3Event, gate : IDBGate, money: number, code: string) : Promise<any> => {
  try {
    const runtimeConfig = useRuntimeConfig(event)
    const { dynamic, type } = gate
    if(!typeFormat[type]) throw 'Kiểu kênh nạp không hỗ trợ'
    if(!dynamic.api || !dynamic.sign) throw 'Kênh nạp chưa sẵn sàng, vui lòng thử lại sau'

    const send = await axios.post(dynamic.api, {
      'type': typeFormat[type],   // Loại MOMO/BANK
      'chargeId': code,           // Mã GD nạp
      'amount': money,            // Số tiền nạp
      'cbUrl': `http://${runtimeConfig.public.domain}/api/callback/payment/verify`,
      'sign':  createSignature(typeFormat[type]+''+code+''+money+''+dynamic.sign)
    },{
      timeout: 10_000
    })
    const res = send.data
    if(!res) throw 'API đang gặp sự cố, vui lòng thử lại'
    if(!res.status || (res.status && res.status == 'error')) throw res.message || 'Không xác định mã lỗi'

    const { bankName, accNo, accName, cashId, imageQrcode, transferCode } = res.data
    if(!cashId) throw 'Thiếu ID khởi tạo giao dịch'
    if(!transferCode) throw 'Thiếu nội dung khởi tạo giao dịch'
    const channel = {
      id: cashId,
      name: bankName,
      person: accName,
      number: accNo,
      content: transferCode
    }
    return { channel, qrcode: imageQrcode }
  }
  catch(e : any){
    if (axios.isAxiosError(e) && e.code === 'ECONNABORTED') {
      throw 'Quá thời gian gọi API cho phép'
    }
    throw `Lỗi tạo giao dịch: ${e.toString()}`
  }
}