import md5 from "md5"
import type { IAuth, IDBConfig, IDBGate, IDBPayment, IDBPaymentConfig } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    // Check Body
    const body = await readBody(event)
    const { gate, card, money } = body
    if(!gate || !card) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!!isNaN(parseInt(money)) || parseInt(money) < 1) throw 'Số tiền không hợp lệ'
    if(parseInt(money) % 10000 != 0) throw 'Số tiền phải là bội số của 10.000'
    if(parseInt(money) > 50000000) throw 'Số tiền nhập vào quá lớn'

    // Config
    const config = await DB.Config.findOne({}).select('short_name') as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình trang'

    // Payment Config
    const paymentConfig = await DB.PaymentConfig.findOne() as IDBPaymentConfig
    if(!paymentConfig) throw 'Không tìm thấy cấu hình cổng nạp'
    if(!!paymentConfig.maintenance) throw 'Chức năng nạp tiền đang bảo trì, vui lòng quay lại sau'
    if(parseInt(money) < paymentConfig.min) throw `Số tiền phải lớn hơn hoặc bằng ${paymentConfig.min.toLocaleString("vi-VN")} VNĐ`

    // Check Gate
    const gateSelect = await DB.Gate.findOne({ _id: gate }) as IDBGate
    if(!gateSelect) throw 'Kênh nạp không tồn tại'
    if(gateSelect.display < 1) throw 'Kênh nạp đang bảo trì'

    // Make Code, Token
    const countPayment = await DB.Payment.count()
    const prefix = config.short_name ? config.short_name.trim().toUpperCase() : 'PAY'
    const code = prefix + (countPayment > 9 ? countPayment : `0${countPayment}`) + Math.floor(Math.random() * (99 - 10) + 10)
    const token = md5(`${code}-${Date.now()}`)

    // Make Payment
    let payment : IDBPayment
    
    // Check Card
    if(gateSelect.type == 1){
      const key = gateSelect.dynamic.enable ? gateSelect.dynamic.sign : gateSelect.key
      if(!key) throw 'Kênh thẻ cào đang bảo trì'
      if(!card.net || !card.seri || !card.pin) throw 'Thông tin thẻ cào không hợp lệ'

      const channel = await checkCard(event, {
        net: card.net,
        seri: card.seri,
        pin: card.pin,
        money: parseInt(money),
        token: token,
        code: code,
        key: key
      }, gateSelect.dynamic.enable ? gateSelect.dynamic : null)

      // Create
      payment = await DB.Payment.create({
        user: auth._id,
        gate: gateSelect._id,
        channel: channel,
        card: card,
        money: parseInt(money),
        code: code,
        token: token,
      })
    }

    // Check Momo / Bank
    else {
      let qrcode
      let channel

      // If Has Dynamic
      if(!!gateSelect.dynamic.enable){
        const dynamic = await dynamicPaymentCreate(event, gateSelect, money, code)
        if(!dynamic.channel) throw 'Kênh nạp đang gặp sự cố, vui lòng quay lại sau'
        channel = dynamic.channel
        qrcode = dynamic.qrcode
      }

      // No Dynamic
      else {
        channel = { 
          name: gateSelect.name, 
          person: gateSelect.person,
          number: gateSelect.number,
          content: code 
        }
        if(!!gateSelect.qrcode){
          qrcode = gateSelect.qrcode
          qrcode = qrcode.replaceAll('[money]', String(parseInt(money)))
          qrcode = qrcode.replaceAll('[code]', code)
          qrcode = qrcode.replaceAll('[token]', token)
          qrcode = qrcode.replaceAll('[gate-name]', gateSelect.name)
          qrcode = qrcode.replaceAll('[gate-number]', gateSelect.number)
          qrcode = qrcode.replaceAll('[gate-person]', gateSelect.person)
        }
      }
      
      // Create
      payment = await DB.Payment.create({
        user: auth._id,
        gate: gateSelect._id,
        channel: channel,
        qrcode: qrcode,
        money: parseInt(money),
        code: code,
        token: token,
      })
    }

    if(!payment) throw "Tạo giao dịch thất bại, vui lòng thử lại sau"
    return resp(event, { message: 'Tạo giao dịch thành công', result: payment._id })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})
