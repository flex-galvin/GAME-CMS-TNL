import type { IAuth } from '~~/types'

const DAY = 24 * 60 * 60 * 1000

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const { start : startDate, end: endDate } = await readBody(event)
    if (!startDate || !endDate) throw 'Dữ liệu đầu vào không đủ'

    const start = dayjs(startDate)
    const end = dayjs(endDate)
    if (!start.isValid() || !end.isValid()) throw 'Thời gian không hợp lệ'

    /** STEP 1: USER COHORT */
    const users = await DB.User.find({ createdAt: { $gte: start.toDate(), $lte: end.toDate() }}).select('_id createdAt')
    const userMap = new Map<string, Date>()
    const userIds = users.map(u => {
      userMap.set(String(u._id), u.createdAt)
      return u._id
    })

    const totalUsers = userIds.length
    if (!totalUsers) return resp(event, { result: {
      totalUsers: 0,
      R1: {}, R3: {}, R7: {}, R15: {}, RN: {}
    }})

    /** STEP 2: LOGIN */
    const logins = await DB.UserLogin.find({
      user: { $in: userIds }
    }).select('user createdAt')

    const retention = {
      R1: new Set<string>(),
      R3: new Set<string>(),
      R7: new Set<string>(),
      R15: new Set<string>(),
      RN: new Set<string>()
    }

    for (const l of logins) {
      const createdAt = userMap.get(String(l.user))
      if (!createdAt) continue

      const diff = Math.floor((+l.createdAt - +createdAt) / DAY)

      if (diff === 1) retention.R1.add(String(l.user))
      if (diff === 3) retention.R3.add(String(l.user))
      if (diff === 7) retention.R7.add(String(l.user))
      if (diff === 15) retention.R15.add(String(l.user))
      if (diff > 15) retention.RN.add(String(l.user))
    }

    /** STEP 3: PAYMENT */
    const payments = await DB.Payment.find({
      user: { $in: userIds },
      status: 1
    }).select('user money createdAt')

    const payStat = {
      R1: { users: new Set<string>(), revenue: 0 },
      R3: { users: new Set<string>(), revenue: 0 },
      R7: { users: new Set<string>(), revenue: 0 },
      R15: { users: new Set<string>(), revenue: 0 },
      RN: { users: new Set<string>(), revenue: 0 }
    }

    for (const p of payments) {
      const createdAt = userMap.get(String(p.user))
      if (!createdAt) continue

      const diff = Math.floor((+p.createdAt - +createdAt) / DAY)

      if (diff >= 1) {
        payStat.R1.users.add(String(p.user))
        payStat.R1.revenue += p.money
      }
      if (diff >= 3) {
        payStat.R3.users.add(String(p.user))
        payStat.R3.revenue += p.money
      }
      if (diff >= 7) {
        payStat.R7.users.add(String(p.user))
        payStat.RN.users.add(String(p.user))
        payStat.R7.revenue += p.money
        payStat.RN.revenue += p.money
      }
      if (diff >= 15) {
        payStat.R15.users.add(String(p.user))
        payStat.RN.users.add(String(p.user))
        payStat.R15.revenue += p.money
        payStat.RN.revenue += p.money
      }
    }

    // Return
    const result = {
      totalUsers,

      R1: {
        retentionUsers: retention.R1.size,
        payingUsers: payStat.R1.users.size,
        revenue: payStat.R1.revenue
      },

      R3: {
        retentionUsers: retention.R3.size,
        payingUsers: payStat.R3.users.size,
        revenue: payStat.R3.revenue
      },

      R7: {
        retentionUsers: retention.R7.size,
        payingUsers: payStat.R7.users.size,
        revenue: payStat.R7.revenue
      },

      R15: {
        retentionUsers: retention.R15.size,
        payingUsers: payStat.R15.users.size,
        revenue: payStat.R15.revenue
      },

      RN: {
        payingUsers: payStat.RN.users.size,
        revenue: payStat.RN.revenue
      }
    }

    return resp(event, { result: result })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})