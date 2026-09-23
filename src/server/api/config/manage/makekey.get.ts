import type { IAuth, IDBItem, IDBNews, IDBShopPack } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'config.action')

    // Item Game
    const items = await DB.Item.find({}).select('_id item_name') as Array<IDBItem>
    if (items.length > 0){
      const bulkOps = items
      .filter(item => item.item_name)
      .map(item => ({
        updateOne: {
          filter: { _id: item._id },
          update: {
            $set: {
              key: formatVNString(item.item_name, '-')
            }
          }
        }
      }))
      if (bulkOps.length) await DB.Item.bulkWrite(bulkOps)
    }
    
    // News
    const news = await DB.News.find({}).select('_id title') as Array<IDBNews>
    if (news.length > 0){
      const bulkOps = news
      .filter(item => item.title)
      .map(item => ({
        updateOne: {
          filter: { _id: item._id },
          update: {
            $set: {
              key: formatVNString(item.title, '-')
            }
          }
        }
      }))
      if (bulkOps.length) await DB.News.bulkWrite(bulkOps)
    } 

    // Shop Packs
    const packs = await DB.ShopPack.find({}).select('_id name') as Array<IDBShopPack>
    if (packs.length > 0){
      const bulkOps = packs
      .filter(item => item.name)
      .map(item => ({
        updateOne: {
          filter: { _id: item._id },
          update: {
            $set: {
              key: formatVNString(item.name, '-')
            }
          }
        }
      }))
      if (bulkOps.length) await DB.ShopPack.bulkWrite(bulkOps)
    }

    await logAdmin(event, 'Thao tác <b>tạo lại khóa tìm kiếm</b>')
    return resp(event, { message: 'Thực hiện thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})