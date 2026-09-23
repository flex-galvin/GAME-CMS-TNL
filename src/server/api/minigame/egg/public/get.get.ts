import type { IAuth, IDBEggUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const config = await DB.Egg.findOne().select(`
      one.price two.price three.price four.price five.price six.price
    `)
    if(!config) throw 'Không tìm thấy thông tin cấu hình'

    let source
    const auth = await getAuth(event, false) as IAuth
    if(!auth) source = { one: [], two: [], three: [], four: [], five: [], six: [] }
    else {
      const data = await DB.EggUser
      .findOne({ user: auth._id })
      .select('-createdAt -updatedAt -_id -user')
      .populate({ path: 'one.history', select: 'item amount', populate: { path: 'item', select: 'item_name item_image type' }})
      .populate({ path: 'two.history', select: 'item amount', populate: { path: 'item', select: 'item_name item_image type' }})
      .populate({ path: 'three.history', select: 'item amount', populate: { path: 'item', select: 'item_name item_image type' }})
      .populate({ path: 'four.history', select: 'item amount', populate: { path: 'item', select: 'item_name item_image type' }})
      .populate({ path: 'five.history', select: 'item amount', populate: { path: 'item', select: 'item_name item_image type' }})
      .populate({ path: 'six.history', select: 'item amount', populate: { path: 'item', select: 'item_name item_image type' }}) as IDBEggUser
      if(!!data) source = data
      else source = await DB.EggUser.create({
        user: auth._id,
        one: [], two: [], three: [], four: [], five: [], six: []
      })
    }

    return resp(event, { result: { config, source } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})