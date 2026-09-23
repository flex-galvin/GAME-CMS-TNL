import type { IAuth, IDBLimitedChristmasUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event, false) as IAuth | null
    if(!auth) throw 'Vui lòng đăng nhập trước'

    const userEvent = await DB.LimitedChristmasUser.findOne({ user: auth._id }) as IDBLimitedChristmasUser
    if(!userEvent) throw 'Vui lòng nạp tiền để đăng ký tham gia sự kiện'

    return resp(event, { result: userEvent })
  } 
  catch (e:any) {
    return resp(event, { result: null })
  }
})