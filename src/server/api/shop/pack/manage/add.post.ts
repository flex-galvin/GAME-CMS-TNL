import type { IAuth, IDBShopCategory, IDBShopPack } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'shop.add')

    const body = await readBody(event)
    const { name, price, limit, category } = body
    if(!name) throw 'Dữ liệu đầu vào không hợp lệ'

    if(
      !!isNaN(parseInt(price)) 
      || parseInt(price) < 1
    ) throw 'Dữ liệu giá mua không hợp lệ'

    if(
      !!isNaN(parseInt(limit)) 
      || parseInt(limit) < 0
    ) throw 'Dữ liệu giới hạn không hợp lệ'

    const key = formatVNString(name, '-')
    const getByKey = await DB.ShopPack.findOne({ key: key }).select('_id') as IDBShopPack
    if(!!getByKey) throw 'Tên gói đã tồn tại'
    body.key = key

    if(!!category){
      const check = await DB.ShopCategory.findOne({ _id: category }) as IDBShopCategory
      if(!check) throw 'Danh mục không tồn tại'

      body.category = check._id
    }

    await DB.ShopPack.create(body)

    await logAdmin(event, `Thêm gói <b>${name}</b> vào cửa hàng`)
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})