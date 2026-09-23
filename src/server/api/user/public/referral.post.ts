import type { IAuth, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { size, current, sort, user } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const userCheck = (auth.type > 0 && !!user) ? user : auth._id
    const userData = await DB.User
    .findOne({ _id: userCheck })
    .populate({ path: 'referral.person', select: 'username' }) as IDBUser
    if(!userData) throw 'Không tìm thấy thông tin tài khoản'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1
    const match : any = { 'referral.person' : userData._id }

    const list = await DB.User
    .find(match)
    .select('username pay.total login.month')
    .sort(sorting)
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.User.count(match)

    const result = {
      referral: userData.referral.person,
      list: list,
      total: total
    }

    return resp(event, { result: result })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})