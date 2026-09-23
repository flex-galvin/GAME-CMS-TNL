import { Types } from "mongoose"

export default defineEventHandler(async (event) => {
  try {
    const { size, current, sort, search, category } = await readBody(event)
    if(!size || !current || !sort) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = { pin: -1 }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { 
      display: 1, 
      gift: { $exists: true, $not: { $size: 0 } } 
    }
    if(search){
      match['key'] = { $regex : formatVNString(search, '-'), $options : 'i' }
    }
    if(!!category){
      match['category'] = new Types.ObjectId(category)
    }
    else {
      match['$or'] = [
        { category: { $exists: false } },
        { category: null }
      ]
    }

    const list = await DB.ShopPack
    .find(match)
    .populate({ path: 'gift.item', select: 'item_id item_name item_image type'})
    .sort(sorting)
    .skip((current - 1) * size)
    .limit(size)

    const total = await DB.ShopPack.count(match)
    
    return resp(event, { result: { list, total }})
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})