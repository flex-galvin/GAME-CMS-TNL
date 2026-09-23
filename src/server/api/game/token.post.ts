import type { IAuth } from "~~/types"
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig(event)
    const auth = await getAuth(event) as IAuth
    const { token } = await readBody(event)
    if(!token) throw 'Dữ liệu đầu vào sai'

    const decoded = await jwt.verify(token, runtimeConfig.apiSecret) as any
    const url = decoded.url
    if(!url) throw 'Xác thực phiên chơi thất bại'

    return resp(event, { result: url })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})