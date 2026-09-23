import type { IAuth, IDBShopCategory, IDBShopPack } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'shop.edit')

    const body = await readBody(event)
    const { _id, name, price, limit, category } = body
    if(!_id || !name) throw 'Dữ liệu đầu vào không hợp lệ'

    if(
      !!isNaN(parseInt(price)) 
      || parseInt(price) < 1
    ) throw 'Dữ liệu giá mua không hợp lệ'

    if(
      !!isNaN(parseInt(limit)) 
      || parseInt(limit) < 0
    ) throw 'Dữ liệu giới hạn không hợp lệ'

    const pack = await DB.ShopPack.findOne({ _id: _id }).select('name key') as IDBShopPack
    if(!pack) throw 'Mã không tồn tại'

    const key = formatVNString(name, '-')
    if(pack.key != key){
      const getByKey = await DB.ShopPack.findOne({ key: key }).select('_id') as IDBShopPack
      if(!!getByKey) throw 'Tên gói đã tồn tại'
      body.key = key
    }

    if(!!category){
      const check = await DB.ShopCategory.findOne({ _id: category }) as IDBShopCategory
      if(!check) throw 'Danh mục không tồn tại'

      body.category = check._id
    }

    delete body['_id']
    await DB.ShopPack.updateOne({ _id: _id }, body)

    await logAdmin(event, `Sửa thông tin gói <b>${pack.name}</b> trong cửa hàng`)
    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})