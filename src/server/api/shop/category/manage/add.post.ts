import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'shop.add')

    const body = await readBody(event)
    const { name, type } = body
    if(!name || !type) throw 'Dữ liệu đầu vào không hợp lệ'
    if(!['item', 'pack'].includes(type)) throw 'Dữ liệu đầu vào không hợp lệ'

    await DB.ShopCategory.create(body)
    await logAdmin(event, `Thêm danh mục cửa hàng <b>${name}</b>`)
    
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})