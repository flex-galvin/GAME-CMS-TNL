import type { IAuth, IDBItemBox } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'item.edit')

    const body = await readBody(event)
    const { _id, name, gift } = body
    if(!_id || !name || !gift) throw 'Dữ liệu đầu vào không hợp lệ'

    const itembox = await DB.ItemBox.findOne({ _id: _id }).select('name key') as IDBItemBox
    if(!itembox) throw 'Gói không tồn tại'

    const key = formatVNString(name, '-')
    if(itembox.key != key){
      const getByKey = await DB.ItemBox.findOne({ name: name }).select('_id') as IDBItemBox
      if(!!getByKey) throw 'Tên gói đã tồn tại'
      body.key = key
    }

    delete body['_id']
    const giftFormat = gift.map((i : any) => ({ item: i.item._id, amount: i.amount }))
    body.gift = giftFormat
    
    await DB.ItemBox.updateOne({ _id: _id }, body)

    await logAdmin(event, `Sửa gói vật phẩm <b>${itembox.name}</b>`)
    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})