import type { IAuth, IDBNews, IDBNewsCategory } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'news.edit')

    const body = await readBody(event)
    const { _id, category, title, description } = body
    if(!_id || !category || !title || !description) throw 'Dữ liệu đầu vào không hợp lệ'

    const categoryCheck = await DB.NewsCategory.findOne({ _id: category }).select('_id name') as IDBNewsCategory
    if(!categoryCheck) throw 'Danh mục không tồn tại'

    const newsCheck = await DB.News.findOne({ _id: _id }).select('title key') as IDBNews
    if(!newsCheck) throw 'Tin tức không tồn tại'

    const key = formatVNString(title, '-')
    if(newsCheck.key != key){
      const getByKey = await DB.News.findOne({ key: key }).select('_id') as IDBNews
      if(!!getByKey) throw 'Tiêu đề tin tức đã tồn tại'
      body.key = key
    }

    const keywords = []
    keywords.push(categoryCheck.name)

    delete body['_id']
    body.keywords = keywords.concat(title.split(" "))
    body.updater = auth._id

    await DB.News.updateOne({ _id: _id }, body)
    await logAdmin(event, `Sửa thông tin cơ bản tin tức <b>${newsCheck.title}</b>`)

    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})