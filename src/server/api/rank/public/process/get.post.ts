import { IDBGameRankProcess } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { type, server } = await readBody(event)
    if(!type || !server) throw 'Dữ liệu đầu vào không đủ'

    const processEvent = await DB.GameRankProcess
    .findOne({ type: type, server: server })
    .populate({ path: 'award.gift.item', select: 'item_id item_name item_image type'}) as IDBGameRankProcess

    if(!processEvent) throw 'Sự kiện không tồn tại'
    return resp(event, { result: processEvent })
  } 
  catch (e:any) {
    return resp(event, { result: null })
  }
})