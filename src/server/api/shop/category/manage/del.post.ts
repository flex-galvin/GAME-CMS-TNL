import type { IAuth, IDBShopCategory } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'shop.del')

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'
  
    const category = await DB.ShopCategory.findOne({ _id: _id }).select('name') as IDBShopCategory
    if(!category) throw 'Danh mục không tồn tại'
    
    await DB.Shop.updateMany({ category: category._id }, { category: null })
    await DB.ShopPack.updateMany({ category: category._id }, { category: null })
    await DB.ShopCategory.deleteOne({ _id: _id })
    await logAdmin(event, `Xóa danh mục cửa hàng <b>${category.name}</b>`)

    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})