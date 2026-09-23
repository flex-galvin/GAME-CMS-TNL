import type { IAuth, IDBNewsCategory } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'news.edit')

    const body = await readBody(event)
    const { _id, name, color } = body
    if(!_id || !name || !color) throw 'Dữ liệu đầu vào không hợp lệ'

    const category = await DB.NewsCategory.findOne({ _id: _id }).select('name') as IDBNewsCategory
    if(!category) throw 'Danh mục không tồn tại'
    if(category.name != name){
      const getByName = await DB.NewsCategory.findOne({ name: name }).select('_id') as IDBNewsCategory
      if(!!getByName) throw 'Tên danh mục đã tồn tại'
    }

    delete body['_id']
    await DB.NewsCategory.updateOne({ _id: _id }, body)

    await logAdmin(event, `Sửa thông tin danh mục tin tức <b>${category.name}</b>`)

    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})