export default defineEventHandler(async (event) => {
  try {
    const { types, key } = await readBody(event)
    const keySearch = formatVNString(key, '-')
    const match : any = {
      $or: [
        { item_name: { $regex : keySearch, $options : 'i' }},
        { item_id: { $regex : keySearch, $options : 'i' }},
        { key: { $regex : keySearch, $options : 'i' }},
      ]
    }
    if(!!types && types.length) match['type'] = { $in: types }

    const items = await DB.Item
    .find(match)
    .select('item_id item_name item_image type')
    .limit(20)

    return resp(event, { result: items })
  } 
  catch (e:any) {
    return resp(event, { result: [] })
  }
})