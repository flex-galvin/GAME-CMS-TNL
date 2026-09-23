import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { size, current, sort, from, to, range } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = {}
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = {}
    if(!!from){
      const users = await DB.User.find({
        username : { $regex : from.toLowerCase(), $options : 'i' }
      }).select('_id')
      
      match['from'] = { $in: users.map(i => i._id) }
    }
    if(!!to){
      const users = await DB.User.find({
        username : { $regex : to.toLowerCase(), $options : 'i' }
      }).select('_id')
      
      match['to'] = { $in: users.map(i => i._id) }
    }
    if(!!range && !!range['start'] && !!range['end']){
      match['createdAt'] = { $gte: new Date(range['start']), $lte: new Date(range['end']) }
    }

    const list = await DB.LogAdminSendItem
    .find(match)
    .populate({ path: 'from', select: 'username' })
    .populate({ path: 'to', select: 'username' })
    .populate({ path: 'gift.item', select: 'item_id item_name item_image type'})
    .sort(sorting)
    .skip((current - 1) * size)
    .limit(size)

    const total = await DB.LogAdminSendItem.count(match)

    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})