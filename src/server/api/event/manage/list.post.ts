import type { IAuth, IDBEventConfig } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { size, current, sort, type } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'
    if(!type) throw 'Kiểu sự kiện không hỗ trợ'

    const config = await DB.EventConfig.findOne({ type: type }) as IDBEventConfig
    if(!config) throw 'Kiểu sự kiện không hỗ trợ'

    const sorting : any = { }
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { type: type }
    
    const list = await DB.Event
    .find(match)
    .populate({ path: 'gift.item', select: 'item_id item_name item_image type'})
    .populate({ path: 'awardserver.gift.item', select: 'item_id item_name item_image type'})
    .sort(sorting)
    .skip((current - 1) * size)
    .limit(size)

    const total = await DB.Event.count(match)
    return resp(event, { result: { list, total, config } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})