import type { IAuth, IDBItemBox } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'item.del')

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const itembox = await DB.ItemBox.findOne({ _id: _id }).select('name') as IDBItemBox
    if(!itembox) throw 'Gói không tồn tại'

    await DB.ItemBox.deleteOne({ _id: itembox._id })
    
    await logAdmin(event, `Xóa gói vật phẩm <b>${itembox.name}</b>`)
    return resp(event, { message: 'Xóa thành công' })
  }
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})