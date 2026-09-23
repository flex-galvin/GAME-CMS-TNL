import type { IAuth } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { size, current, sort, range, server_id } = await readBody(event)
    if(!size || !current || !sort) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'
    if(!server_id) throw 'Vui lòng chọn máy chủ'
    
    const sorting : any = {}
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const matchServer : any = { server: server_id }

    const matchTime : any = { }
    if(!!range && !!range['start'] && !!range['end']){
      const start = dayjs(range['start']).startOf('day').toDate()
      const end = dayjs(range['end']).endOf('day').toDate()
      matchTime['time'] = { $gte: start, $lte: end }
    }

    const data = await DB.EggHistory.aggregate([
      { $match: matchServer },
      { $project: { 
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
          _id: '$timeformat',
          time: { $min: '$createdAt' },
          spend: { $sum: "$price" }
        }
      },
      { $match: matchTime },
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
    return resp(event, { code: 400, message: e.toString() })
  }
})