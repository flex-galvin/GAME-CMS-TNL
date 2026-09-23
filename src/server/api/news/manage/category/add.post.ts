import type { IAuth, IDBNewsCategory } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'news.add')

    const body = await readBody(event)
    const { name, color } = body
    if(!name || !color) throw 'Dữ liệu đầu vào không hợp lệ'

    const getByName = await DB.NewsCategory.findOne({ name: name }).select('_id') as IDBNewsCategory
    if(!!getByName) throw 'Tên danh mục đã tồn tại'

    await DB.NewsCategory.create(body)
    await logAdmin(event, `Thêm danh mục tin tức <b>${name}</b>`)
    
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})