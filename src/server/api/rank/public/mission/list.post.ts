export default defineEventHandler(async (event) => {
  try {
    const { server, type } = await readBody(event)
    if(!server || !type) throw 'Dữ liệu đầu vào sai'

    const match : any = { server: server, type: type }

    const list = await DB.GameMission
    .find(match)
    .populate({ path: 'gift.item', select: 'item_id item_name item_image type' })
    .sort({ need: 1 })

    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})