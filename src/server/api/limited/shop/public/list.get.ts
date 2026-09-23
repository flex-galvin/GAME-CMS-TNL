export default defineEventHandler(async (event) => {
  try {
    const now = new Date()

    const list = await DB.LimitedShop.find({
      'time.start': { $lte: now },
      'time.end': { $gte: now },
      $or: [
        { limit: 0 },
        { $expr: { $lt: ['$buyed', '$limit'] } }
      ],
      gift: { $exists: true, $not: { $size: 0 } }
    })
    .populate({ path: 'gift.item', select: 'item_id item_name item_image type'})
    .sort({ 'time.start': 1 })

    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { result: [] })
  }
})