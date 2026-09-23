export default defineEventHandler(async (event) => {
  try {
    const list = await gameGetMore(event)
    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { result: [] })
  }
})