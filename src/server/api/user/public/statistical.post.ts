import type { IAuth, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { user } = await readBody(event)

    const userCheck = (auth.type > 0 && !!user) ? user : auth._id
    const data = await DB.User
    .findOne({ _id: userCheck })
    .select('login pay spend referral') as IDBUser
    if(!data) throw 'Không tìm thấy thông tin tài khoản'

    return resp(event, { result: data })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})