export default defineEventHandler(async (event) => {
  try {
    const list = await DB.Giftcode
    .find({ 
      public: true, 
      display: 1, 
      gift: { $exists: true, $not: { $size: 0 } } 
    })
    .populate({ path: 'gift.item', select: 'item_id item_name item_image type'})
    .select('code limit expired gift')

    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})