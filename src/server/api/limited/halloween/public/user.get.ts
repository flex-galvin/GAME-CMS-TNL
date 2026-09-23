import type { IAuth, IDBLimitedHalloweenUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event, false) as IAuth | null
    if(!auth) throw 'Vui lòng đăng nhập trước'

    const userEvent = await DB.LimitedHalloweenUser
    .findOne({ user: auth._id }) 
    .populate({ path: 'pumpkin.reward.item', select: 'item_id item_name item_image type' })
    .select('-pumpkin.result') as IDBLimitedHalloweenUser
    if(!userEvent) throw 'Vui lòng nạp tiền để đăng ký tham gia sự kiện'

    return resp(event, { result: userEvent })
  } 
  catch (e:any) {
    return resp(event, { result: null })
  }
})