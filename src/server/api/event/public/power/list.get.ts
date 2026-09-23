export default defineEventHandler(async (event) => {
  try {
    const list = await DB.GameRankPowerUpProcess
    .find({ active: true })
    .populate({ path: 'award.gift.item', select: 'item_id item_name item_image type'})

    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})