import { Types } from "mongoose"

export default defineEventHandler(async (event) => {
  try {
    const { size, current, sort, types, search, category } = await readBody(event)
    if(!size || !current || !types || types.length == 0) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const sorting : any = { pin: -1 }
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
    
    const shopItem = await DB.Shop
    .aggregate([
      { $match: { display: 1 } },
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
          as: "itemData"
        }
      },
      { $unwind: { path: '$itemData' }},
      { 
        $addFields: { 
          image: '$itemData.item_image',
          name: '$itemData.item_name',
          type: '$itemData.type',
          key: '$itemData.key',
        }
      },
      { $project: { createdAt: 0, itemData: 0, display: 0 }},
      { $match: match },
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
      list: shopItem[0].list ? shopItem[0].list : [],
      total: shopItem[0].pagination ? (shopItem[0].pagination[0] ? shopItem[0].pagination[0].total : 0) : 0
    }})
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})