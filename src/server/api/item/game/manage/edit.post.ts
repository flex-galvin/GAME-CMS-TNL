import type { IAuth, IDBItem } from "~~/types"

const typeList = [
  'game_item', 'game_recharge'
]

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'item.edit')

    const body = await readBody(event)
    const {_id, item_id, item_name } = body
    if(!_id || !item_id || !item_name) throw 'Dữ liệu đầu vào không hợp lệ'

    const item = await DB.Item.findOne({ _id: _id }).select('item_id item_name type') as IDBItem
    if(!item) throw 'Vật phẩm không tồn tại'
    if(!typeList.includes(item.type)) throw 'Không thể sửa vật phẩm mặc định'

    if(item.item_id != item_id){
      const checkDup = await DB.Item.findOne({ item_id: item_id, type: item.type }).select('_id') as IDBItem
      if(!!checkDup) throw 'ID vật phẩm đã tồn tại'
    }

    const key = formatVNString(item_name, '-')
    body.key = key

    delete body['_id']
    await DB.Item.updateOne({ _id: _id }, body)
    
    await logAdmin(event, `Sửa vật phẩm trò chơi <b>${item.item_name}</b>`)
    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})