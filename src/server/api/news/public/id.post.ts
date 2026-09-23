import { IDBNews } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { _id } = await readBody(event)
    if(!_id) throw 'Không tìm thấy ID tin tức'

    const match : any = { display: 1, _id: _id }
    const news = await DB.News
    .findOneAndUpdate(match, { $inc: { view: 1 } }, { new: true })
    .populate({ path: 'category', select: 'name color' })
    .populate({ path: 'updater', select: 'avatar username' }) as IDBNews

    if(!news) throw 'Tin tức không tồn tại'
    return resp(event, { result: news })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})