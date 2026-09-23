import type { IAuth, IDBShopCategory } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'shop.edit')

    const body = await readBody(event)
    const { _id, name } = body
    if(!_id || !name) throw 'Dữ liệu đầu vào không hợp lệ'

    const category = await DB.ShopCategory.findOne({ _id: _id }).select('name') as IDBShopCategory
    if(!category) throw 'Danh mục không tồn tại'

    delete body['_id']
    await DB.ShopCategory.updateOne({ _id: _id }, body)

    await logAdmin(event, `Sửa thông tin danh mục cửa hàng <b>${category.name}</b>`)

    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})