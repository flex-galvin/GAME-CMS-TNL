import type { IAuth, IDBEggUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const eggUser = await DB.EggUser.findOne({ user: auth._id }).select('_id') as IDBEggUser
    if(!eggUser) await DB.EggUser.create({ user: auth._id,  one: [], two: [], three: [], four: [], five: [], six: [] })
    else await DB.EggUser.updateOne({ user: auth._id }, { one: [], two: [], three: [], four: [], five: [], six: [] })

    return resp(event, { message: 'Đặt lại thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})