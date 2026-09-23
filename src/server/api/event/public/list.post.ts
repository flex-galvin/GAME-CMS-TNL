import type { IDBEventConfig } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { type } = await readBody(event)
    if(!type) throw 'Kiểu sự kiện không hỗ trợ'

    const eventConfig = await DB.EventConfig.findOne({ type: type }) as IDBEventConfig
    if(!eventConfig) throw 'Kiểu sự kiện không hỗ trợ'

    const list = await DB.Event
    .find({ type: type, display: 1 })
    .populate({ path: 'gift.item', select: 'item_id item_name item_image type'})
    .populate({ path: 'awardserver.gift.item', select: 'item_id item_name item_image type'})
    .select('need type gift awardserver')
    .sort({ need: 1 })

    const format = JSON.parse(JSON.stringify(list))
    
    for (let i = 0; i < format.length; i++) {
      format[i].status = await getEventActive(event, format[i], type)
    }

    return resp(event, { result: { config: eventConfig, list: format } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})