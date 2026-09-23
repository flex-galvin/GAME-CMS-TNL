import { IAuth, IDBConfig, IDBPaymentConfig } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const configPay = await DB.PaymentConfig.findOne() as IDBPaymentConfig
    if(!configPay) throw 'Không tìm thấy cấu hình'
    const result = JSON.parse(JSON.stringify(configPay))

    const auth = await getAuth(event, false) as IAuth | null
    if(!auth){
      result.frist = false
      result.second = false
    }
    else {
      const countPayDone = await DB.Payment.count({ user: auth._id, status: 1 })
      result.frist = countPayDone > 0 ? true : false
      result.second = countPayDone > 1 ? true : false
    }

    return resp(event, { result: result })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})