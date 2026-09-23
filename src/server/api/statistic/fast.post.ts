import type { IAuth } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const { type } = await readBody(event)
    if(!type) throw 'Dữ liệu đầu vào không đủ'

    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    let start : any, end : any, format : any
    let payment : any, signin : any, signup : any, spend : any
    const now = dayjs()
    const yesterday = now.add(-1, 'day')
    const lastmonth = now.add(-1, 'month')

    // Today, Yesterday
    if(type == 'today' || type == 'yesterday'){
      if(type == 'today'){
        start = now.startOf('day')
        end = now.endOf('day')
      }
      if(type == 'yesterday'){
        start = yesterday.startOf('day')
        end = yesterday.endOf('day')
      }

      format = '%Y-%m-%d'
    }

    // This Month, Last Month
    if(type == 'month' || type == 'lastmonth'){
      if(type == 'month'){
        start = now.startOf('month')
        end = now.endOf('month')
      }
      if(type == 'lastmonth'){
        start = lastmonth.startOf('month')
        end = lastmonth.endOf('month')
      }
      
      format = '%Y-%m'
    }

    // Not Total
    if(type != 'total'){
      const match : any = {}
      match['time'] = { $gte: start.toDate(), $lte: end.toDate() }

      payment = await DB.Payment.aggregate([
        {
          $project: {
            createdAt: 1,
            timeformat: {
              $dateToString: { format: format, date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' }
            },
            money: {
              total: { $cond: [{$eq: ['$status', 1]} , '$money', 0] },
            }
          }
        },
        {
          $group: {
            _id: '$timeformat',
            time: { $min: '$createdAt' },
            money: { $sum: '$money.total' },
          }
        },
        { $match: match }
      ])

      spend = await DB.Spend.aggregate([
        {
          $project: {
            time: 1,
            timeformat: {
              $dateToString: { format: format, date: '$time', timezone: 'Asia/Ho_Chi_Minh' }
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
        { $match: match }
      ])
  
      signin = await DB.UserLogin.aggregate([
        {
          $project: {
            user: 1,
            createdAt: 1,
            timeformat: {
              $dateToString: { format: format, date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' }
            }
          }
        },
        {
          $group: {
            _id: {
              timeformat: '$timeformat',
              user: '$user'
            },
            time: { $min: '$createdAt' },
          }
        },
        { $match: match },
        {
          $group: {
            _id: '$_id.timeformat',
            time: { $min: '$time' },
            count: { $count: {} },
          }
        }
      ])
  
      signup = await DB.User.aggregate([
        {
          $project: {
            createdAt: 1,
            timeformat: {
              $dateToString: { format: format, date: '$createdAt', timezone: 'Asia/Ho_Chi_Minh' }
            }
          }
        },
        {
          $group: {
            _id: '$timeformat',
            time: { $min: '$createdAt' },
            count: { $count: {} },
          }
        },
        { $match: match }
      ])
    }

    // Is Total
    if(type == 'total') {
      payment = await DB.Payment.aggregate([
        { $match: { 'status': 1 }},
        {
          $group: {
            _id: null,
            money: { $sum: '$money' },
          }
        }
      ])

      spend = await DB.Spend.aggregate([
        {
          $group: {
            _id: null,
            money: { $sum: '$money' },
          }
        }
      ])

      const users = await DB.User.count()
      signin = [{ count: users }]
      signup = [{ count: users }]
    }

    // Result
    return resp(event, {
      result: {
        payment: payment[0] ? payment[0]['money'] : 0,
        spend: spend[0] ? spend[0]['money'] : 0,
        signin: signin[0] ? signin[0]['count'] : 0,
        signup: signup[0] ? signup[0]['count'] : 0,
      }
    })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})