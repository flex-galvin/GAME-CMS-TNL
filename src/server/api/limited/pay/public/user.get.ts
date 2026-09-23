import type { IAuth, IDBLimitedPayUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event, false) as IAuth | null
    if(!auth) throw 'Vui lòng đăng nhập trước'

    const result : any = { money: 0, receive: [] }

    // Check User
    const userEvent = await DB.LimitedPayUser.findOne({ user: auth._id }).select('money') as IDBLimitedPayUser
    if(!!userEvent) result.money = userEvent.money

    // Check History
    const history = await DB.LimitedPayHistory.find({ user: auth._id }).select('money').sort({ money: 1 })
    if(history.length > 0) result.receive = history.map(i => i.money)

    return resp(event, { result: result })
  } 
  catch (e:any) {
    return resp(event, { result: { money: 0, receive: [] } })
  }
})