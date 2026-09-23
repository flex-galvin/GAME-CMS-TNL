import type { IAuth, IDBNews } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'news.edit')

    const { _id, content } = await readBody(event)
    if(!_id || !content) throw 'Dữ liệu đầu vào không đủ'

    const news = await DB.News.findOne({ _id: _id }).select('title') as IDBNews
    if(!news) throw 'Tin tức không tồn tại'

    await DB.News.updateOne({ 
      _id: _id 
    },{ 
      content: content, 
      updater: auth._id 
    })

    await logAdmin(event, `Sửa nội dung tin tức <b>${news.title}</b>`)

    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})