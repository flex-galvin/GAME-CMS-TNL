import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'payment.verify')

    const { _id } = await readBody(event)
    const status = await dynamicPaymentCheck(_id)
    return resp(event, { message: status })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})