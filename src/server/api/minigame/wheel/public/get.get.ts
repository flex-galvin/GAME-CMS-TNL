export default defineEventHandler(async (event) => {
  try {
    const list = await DB.Wheel
    .find({ display: 1 })
    .populate({ path: 'item', select: 'item_id item_name item_image type' })
    .sort({ updatedAt: -1 })
    .limit(10)

    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})