import { Types } from "mongoose"

export default defineEventHandler(async (event) => {
  try {
    const { size, current, category, search } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'

    const match : any = { display: 1 }
    if(!!category){
      match['category'] = new Types.ObjectId(category)
    }
    if(!!search){
      match['$or'] = [
        { title: { $regex : search, $options : 'i' }},
        { key: { $regex : formatVNString(search, '-'), $options : 'i' }},
      ]
    }

    const list = await DB.News
    .find(match)
    .select('category title description key og_image pin createdAt')
    .populate({ path: 'category', select: 'name color' })
    .sort({ pin: -1, createdAt: -1 })
    .limit(size)
    .skip((current - 1) * size)

    const total = await DB.News.count(match)
    return resp(event, { result: { list, total } })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})