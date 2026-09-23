import type { IAuth, IDBNews } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'news.del')

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const news = await DB.News.findOne({ _id: _id }).select('title') as IDBNews
    if(!news) throw 'Tin tức không tồn tại'

    await DB.News.deleteOne({ _id: _id })
    await logAdmin(event, `Xóa tin tức <b>${news.title}</b>`)

    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})