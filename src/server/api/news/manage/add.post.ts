import type { IAuth, IDBNews, IDBNewsCategory } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'news.add')

    const body = await readBody(event)
    const { category, title, description } = body
    if(!category || !title || !description) throw 'Dữ liệu đầu vào không hợp lệ'

    const categoryCheck = await DB.NewsCategory.findOne({ _id: category }).select('_id name') as IDBNewsCategory
    if(!categoryCheck) throw 'Danh mục không tồn tại'

    const key = formatVNString(title, '-')
    const newsCheck = await DB.News.findOne({ key: key }).select('_id') as IDBNews
    if(!!newsCheck) throw 'Tiêu đề tin tức đã tồn tại'

    const keywords = []
    keywords.push(categoryCheck.name)

    body.keywords = keywords.concat(title.split(" "))
    body.creator = auth._id
    body.updater = auth._id
    body.key = key

    await DB.News.create(body)
    await logAdmin(event, `Thêm tin tức <b>${title}</b>`)

    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})