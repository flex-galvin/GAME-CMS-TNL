export default defineEventHandler(async (event) => {
  try {
    const news = await DB.News
    .find({ display: 1 })
    .select('category title description key og_image pin createdAt')
    .populate({ path: 'category', select: 'name color' })
    .sort({ pin: -1, createdAt: -1 })
    .limit(6)

    return resp(event, { result: news })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})