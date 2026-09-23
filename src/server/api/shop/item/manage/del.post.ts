import type { IAuth, IDBItem, IDBShop } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'shop.del')

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const shopItem = await DB.Shop.findOne({ _id: _id }).select('item') as IDBShop
    if(!shopItem) throw 'Vật phẩm cửa hàng không tồn tại'
    const itemData = await DB.Item.findOne({ _id: shopItem.item }).select('item_name') as IDBItem

    await DB.Shop.deleteOne({ _id: shopItem._id })
    await logAdmin(event, `Xóa vật phẩm <b>${itemData ? itemData.item_name : 'Không Xác Định'}</b> khỏi cửa hàng`)
    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})