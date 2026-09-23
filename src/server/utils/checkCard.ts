import type { H3Event } from 'h3'
import axios from 'axios'
import md5 from 'md5'
import { createHash } from 'crypto'
import { IDBGate } from '~~/types'

interface ICardData {
  net: string
  seri: string
  pin: string
  money: number
  token: string
  code: string
  key: string
}

const createSignature = (str : string) => {
  return createHash('sha256').update(str).digest('hex')
}

export default async (event: H3Event, data : ICardData, dynamic? : IDBGate['dynamic'] | null) : Promise<any> => {
  const channel : any = {
    name: 'CARD',
    person: 'CARD',
    number: 'CARD',
    content: 'CARD'
  }
  
  try {
    if(!dynamic){
      const { net, seri, pin, money, key, token, code } = data
      const url = 'https://thesieure.com/chargingws/v2'

      const partner = key.split('-')
      const partner_id = partner[0]
      const partner_key = partner[1]
      if(!partner_id || !partner_key) throw 'Khóa bí mật không chính xác, vui lòng liện hệ CSKH để được hỗ trợ'

      const send = await axios.post(url, {
        'telco': net,
        'code': pin,
        'serial': seri,
        'amount': String(money),
        'request_id': code+'-'+token,
        'partner_id': partner_id,
        'sign':  md5(partner_key + '' + pin + '' + seri),
        'command': 'charging',
      },{
        timeout: 10_000
      })

      const res = send.data
      const status = res['status']
      if(!status) throw 'Lỗi hệ thống API'
      if(status != 1 && status != 2 && status != 99) throw 'Lỗi thẻ hoặc hệ thống bảo trì'

      channel.content = pin
      return channel
    }

    else {
      const runtimeConfig = useRuntimeConfig(event)
      if(!dynamic.api || !dynamic.sign) throw 'Kênh nạp chưa sẵn sàng, vui lòng thử lại sau'

      const { net, seri, pin, money, code } = data
      const send = await axios.post(dynamic.api, {
        'chargeId': code,               // Mã GD nạp
        'cardType': net,               // Loại Card
        'cardSerial': seri,             // Số Serial
        'cardPin': pin,                // Mã PIN
        'cardValue': money,             // Số tiền nạp
        'cbUrl': `http://${runtimeConfig.public.domain}/api/callback/payment/verify`,
        'sign':  createSignature(net+''+code+''+money+''+dynamic.sign)
      },{
        timeout: 10_000
      })

      const res = send.data
      if(!res) throw 'API đang gặp sự cố, vui lòng thử lại'
      if(!res.status || (res.status && res.status == 'error')) throw res.message || 'Không xác định mã lỗi'
      
      const { cashId } = res.data
      if(!cashId) throw 'Thiếu ID khởi tạo giao dịch'

      channel.id = cashId
      channel.content = pin
      return channel
    }
  }
  catch(e : any){
    if (axios.isAxiosError(e) && e.code === 'ECONNABORTED') {
      throw 'Quá thời gian gọi API cho phép'
    }
    throw `Lỗi tạo giao dịch: ${e.toString()}`
  }
}