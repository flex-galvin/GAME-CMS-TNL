import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { size, current, range, server } = await readBody(event)
    if(!size || !current) throw 'Dữ liệu phân trang sai'
    if(!range) throw 'Dữ liệu thời gian sai'

    const matchServer : any = {}
    if(!!server) matchServer['server'] = server

    const matchTime : any = {}
    if(!!range && !!range['start'] && !!range['end']){
      const start : any = dayjs(range['start']).toDate()
      const end : any = dayjs(range['end']).toDate()
      matchTime['time'] = { $gte: start, $lte: end }
    }

    const data = await DB.EggHistory.aggregate([
      { $match: matchServer },
      { $project: { 
        user: 1, 
        price: 1, 
        createdAt: 1,
        timeformat: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' }
        }
      }},
      {
        $unionWith: {
          coll: "ShopHistory",
          pipeline: [
            { $match: matchServer },
            { $project: { 
              user: 1, 
              price: 1, 
              createdAt: 1,
              timeformat: {
                $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' }
              }
            }}
          ]
        }
      },
      {
        $unionWith: {
          coll: "ShopPackHistory",
          pipeline: [
            { $match: matchServer },
            { $project: { 
              user: 1, 
              price: 1, 
              createdAt: 1,
              timeformat: {
                $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' }
              }
            }}
          ]
        }
      },
      {
        $unionWith: {
          coll: "LimitedShopHistory",
          pipeline: [
            { $match: matchServer },
            { $project: { 
              user: 1, 
              price: 1, 
              createdAt: 1,
              timeformat: {
                $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' }
              }
            }}
          ]
        }
      },
      {
        $group: {
          _id: {
            timeformat: '$timeformat',
            user: '$user'
          },
          time: { $min: '$createdAt' },
          value: { $sum: "$price" }
        }
      },
      { $match: matchTime },
      {
        $group: {
          _id: '$_id.user',
          value: { $sum: "$value" }
        }
      },
      {
        $lookup: {
          from: "User",
          localField: "_id",
          foreignField: "_id",
          pipeline: [
            { $project: { username: 1 }}
          ],
          as: "user"
        }
      },
      { $unwind: { path: "$user" }},
      {
        $facet: {
          list: [
            { $sort: { value: -1 } },
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
      list: data[0].list ? data[0].list : [],
      total: data[0].pagination ? (data[0].pagination[0] ? data[0].pagination[0].total : 0) : 0
    }})
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})