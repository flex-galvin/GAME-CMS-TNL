import type { IAuth, IDBItem } from "~~/types"
import axios from 'axios'

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'item.add')

    const body = await readBody(event)
    const { items } = body
    if(!items) throw 'Dữ liệu đầu vào sai'

    const url =  new URL(items, runtimeConfig.public.clientURL)
    const { data } = await axios.get(url.href, {
      timeout: 10_000
    })
    if (!Array.isArray(data)) throw 'Dữ liệu trả về không hợp lệ'

    const bulkOps = data
      .filter((i: IDBItem) => i.item_id && i.item_name)
      .map((i: IDBItem) => {
        const doc = {
          item_id: i.item_id,
          item_name: i.item_name,
          item_image: i.item_image,
          type: i.type || 'game_item',
          key: formatVNString(i.item_name, '-')
        }

        return {
          updateOne: {
            filter: { item_id: doc.item_id, type: doc.type },
            update: { $set: doc },
            upsert: true
          }
        }
      })

    if (bulkOps.length) await DB.Item.bulkWrite(bulkOps)

    await logAdmin(event, `Thêm danh sách vật phẩm trò chơi`)
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    if (axios.isAxiosError(e) && e.code === 'ECONNABORTED') {
      throw 'Quá thời gian gọi API cho phép'
    }
    return resp(event, { code: 400, message: e.toString() })
  }
})