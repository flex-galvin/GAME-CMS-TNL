export default defineEventHandler(async (event) => {
  try {
    const { type } = await readBody(event)
    const list = await DB.ShopCategory.find({ type: type }).select('name')
    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { result: [] })
  }
})