export default defineEventHandler(async (event) => {
  try {
    const list = await DB.ItemBox
    .find({})
    .populate({ path: 'gift.item', select: 'item_id item_name item_image type'})

    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { result: [] })
  }
})