import type { IAuth, IDBLimitedLunarUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event, false) as IAuth | null
    if(!auth) throw 'Vui lòng đăng nhập trước'

    const userEvent = await DB.LimitedLunarUser.findOne({ user: auth._id }) as IDBLimitedLunarUser
    if(!userEvent) throw 'Vui lòng nạp tiền để đăng ký tham gia sự kiện'

    return resp(event, { result: userEvent })
  } 
  catch (e:any) {
    return resp(event, { result: null })
  }
})