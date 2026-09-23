import { Types } from "mongoose"
import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { size, current, sort, types, search, category } = await readBody(event)
    if(!size || !current || !types || types.length == 0) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = {}
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = { type: { $in: types }}
    if(search){
      match['key'] = { $regex : formatVNString(search, '-'), $options : 'i' }
    }
    if(!!category){
      match['category'] = new Types.ObjectId(category)
    }
    else {
      match['$or'] = [
        { category: { $exists: false } },
        { category: null }
      ]
    }

    const shops = await DB.Shop
    .aggregate([
      {
        $lookup: {
          from: "Item",
          localField: "item",
          foreignField: "_id",
          pipeline: [{
            $project: {
              item_name: 1, item_image: 1, type: 1, key: 1
            },
          }],
          as: "item_data"
        }
      },
      { $unwind: { path: '$item_data' }},
      { 
        $addFields: { 
          image: '$item_data.item_image',
          name: '$item_data.item_name',
          type: '$item_data.type',
          key: '$item_data.key',
        }
      },
      { $project: { createdAt: 0, item_data: 0 }},
      { $match: match },
      {
        $lookup: {
          from: "ShopCategory",
          localField: "category",
          foreignField: "_id",
          pipeline: [{
            $project: { name: 1 },
          }],
          as: "category"
        }
      },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true }},
      {
        $facet: {
          list: [
            { $sort: sorting },
            { $skip: (current - 1) * size },
            { $limit: size },
          ],
          pagination: [
            { $count: "total" }
          ]
        }
      }
    ])

    return resp(event, { result: { 
      list: shops[0].list ? shops[0].list : [],
      total: shops[0].pagination ? (shops[0].pagination[0] ? shops[0].pagination[0].total : 0) : 0
    }})
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})