import type { IAuth, IDBUser } from "~~/types"
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { username, role, server } = body

    const user = await DB.User.findOne({ username: username }).select('_id') as IDBUser
    const url = await gameStart(event, username)
    const token = jwt.sign({ url : url }, runtimeConfig.apiSecret, { expiresIn: '360d' })

    return resp(event, { result: {
      token: token,
      user: user ? user._id : '',
      role: role || '',
      server: server || ''
    } })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})