import type { IAuth, IDBItemBox } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'item.add')

    const body = await readBody(event)
    const { name, gift } = body
    if(!name || !gift) throw 'Dữ liệu đầu vào không hợp lệ'

    const key = formatVNString(name, '-')
    const getByKey = await DB.ItemBox.findOne({ key: key }).select('_id') as IDBItemBox
    if(!!getByKey) throw 'Tên gói đã tồn tại'
    body.key = key

    const giftFormat = gift.map((i : any) => ({ item: i.item._id, amount: i.amount }))
    body.gift = giftFormat

    await DB.ItemBox.create(body)

    await logAdmin(event, `Thêm gói vật phẩm <b>${name}</b>`)
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})