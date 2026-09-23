import type { H3Event } from 'h3'
import type { IDBUser, IResp, IAuth } from '~~/types'
import jwt from 'jsonwebtoken'

export default async (event: H3Event, throwError : boolean = true) : Promise<IAuth | IResp | null> => {
  const runtimeConfig = useRuntimeConfig()

  try {
    const token = getCookie(event, 'token-auth')
    if(!token) throw 'Vui lòng đăng nhập trước'

    const decoded = await jwt.verify(token, runtimeConfig.apiSecret) as any
    const user = await DB.User.findOne({ _id: decoded._id }).select('username block type token action') as IDBUser

    if(!user) throw 'Xác thực tài khoản không thành công'
    if(user.token != token) throw 'Tài khoản đang đăng nhập ở nơi khác, vui lòng đăng nhập lại'
    if(user.block == 1) throw 'Tài khoản đang bị khóa, vui lòng đăng nhập bằng tài khoản khác'

    const result = { 
      _id: user._id,
      username: user.username,
      type: user.type,
      action: user.action
    }
    event.context.auth = result
    return result
  }
  catch (e:any) {
    if(!!throwError) {
      deleteCookie(event, 'token-auth', runtimeConfig.public.cookieConfig)
      event.node.res.end(JSON.stringify({code: 401, message: e.toString()}))
    }
    return null
  }
}