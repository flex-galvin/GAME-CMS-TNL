import { IDBShop, IDBItem, IAuth, IDBShopCategory } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'shop.edit')

    const body = await readBody(event)
    const { _id, item_amount, price, limit, category } = body
    if(!_id || !price) throw 'Dữ liệu đầu vào không hợp lệ'
    if(
      !!isNaN(parseInt(item_amount))
      || parseInt(item_amount) < 1
    ) throw 'Số lượng không hợp lệ'
    if(
      !!isNaN(parseInt(price))
      || parseInt(price) < 1
    ) throw 'Giá tiền không hợp lệ'
    if(
      !!isNaN(parseInt(limit))
      || parseInt(limit) < 0
    ) throw 'Giới không hợp lệ'

    const shopItem = await DB.Shop.findOne({ _id: _id }).select('item') as IDBShop
    if(!shopItem) throw 'Vật phẩm không tồn tại'

    if(!!category){
      const check = await DB.ShopCategory.findOne({ _id: category }) as IDBShopCategory
      if(!check) throw 'Danh mục không tồn tại'

      body.category = check._id
    }

    const itemData = await DB.Item.findOne({ _id: shopItem.item }).select('item_name') as IDBItem
    delete body['_id']
    await DB.Shop.updateOne({ _id: _id }, body)

    await logAdmin(event, `Sửa thông tin vật phẩm <b>${itemData.item_name}</b> ở cửa hàng`)
    
    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})