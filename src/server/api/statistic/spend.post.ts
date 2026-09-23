import type { IAuth } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const { size, current, sort, range } = await readBody(event)
    if(!size || !current || !sort) throw 'Dữ liệu phân trang sai'
    if(!sort.column || !sort.direction) throw 'Dữ liệu sắp xếp sai'

    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'
    
    const sorting : any = {}
    sorting[sort.column] = sort.direction == 'desc' ? -1 : 1

    const match : any = {}
    if(!!range && !!range['start'] && !!range['end']){
      const start = dayjs(range['start']).startOf('day').toDate()
      const end = dayjs(range['end']).endOf('day').toDate()
      match['time'] = { $gte: start, $lte: end }
    }

    const spend = await DB.Spend.aggregate([
      {
        $project: {
          time: 1,
          timeformat: {
            $dateToString: { format: '%Y-%m-%d', date: '$time', timezone: 'Asia/Ho_Chi_Minh' }
          },
          money: 1
        }
      },
      {
        $group: {
          _id: '$timeformat',
          time: { $min: '$time' },
          money: { $sum: '$money' },
        }
      },
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
      list: spend[0].list ? spend[0].list : [],
      total: spend[0].pagination ? (spend[0].pagination[0] ? spend[0].pagination[0].total : 0) : 0
    }})
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})