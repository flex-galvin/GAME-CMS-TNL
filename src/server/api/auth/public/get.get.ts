import type { IAuth, IDBLevel, IDBUser, IDBUserLogin, IDBUserStore } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    // Get User
    const auth = await getAuth(event) as IAuth
    const user = await DB.User
    .findOne({ _id: auth._id })
    .select('username type currency level vip login paymusty pay spend referral.code') as IDBUser

    // Get Date
    const now  = new Date()
    const nowDate = formatDate(now)
    const lastDate = formatDate(user.login.update)
    const IP = getRequestIP(event, { xForwardedFor: true })

    // Khởi tạo các hàm
    let lunarBonusPromise: Promise<any> | null = null
    let loginUpsertPromise: Promise<any> | null = null

    // Update If Is Next Day
    const isNextDay =
      lastDate.day !== nowDate.day ||
      lastDate.month !== nowDate.month ||
      lastDate.year !== nowDate.year

    if(isNextDay){
      user.paymusty = []
      user.login.month += 1
      user.login.total += 1
      user.pay.day.money = 0
      user.spend.day.coin = 0

      // Check VIP
      if(!!user.vip){
        const isExpiredVipDay =
          user.vip.enable &&
          user.vip.type == 'day' &&
          user.vip.end &&
          dayjs(now).unix() > dayjs(user.vip.end).unix()

        if(!user.vip.enable || isExpiredVipDay){
          user.vip.enable = false
          user.vip.end = null
          user.vip.type = ''
        }

        user.vip.gift = false // Reset Quà
      }
    }
    
    // Update If Is Next Month
    const isNextMonth =
      lastDate.month !== nowDate.month ||
      lastDate.year !== nowDate.year
    if(isNextMonth){
      user.login.month = 1
      user.pay.month.money = 0
      user.spend.month.coin = 0
    }

    // Add User Login
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
    loginUpsertPromise = DB.UserLogin.updateOne(
      {
        user: user._id,
        createdAt: { $gte: startOfToday, $lt: startOfTomorrow },
      },
      { $setOnInsert: { user: user._id } },
      { upsert: true }
    )

    // Tặng Lì Xì Năm Mới Mỗi Ngày
    if(isNextDay || !user.login.update) lunarBonusPromise = limitedLunarDayBonus(user._id)

    // Update Level
    const levelPromise = await DB.Level.findOne({
      $and: [
        { 'need.login': { $lte: user.login.total } },
        { 'need.pay.money': { $lte: user.pay.total.money } },
        { 'need.spend.coin': { $lte: user.spend.total.coin } },
      ]
    })
    .select('number bonus bonus_wheel discount')
    .sort({ number: -1 }) as IDBLevel
    const [realLevel] = await Promise.all([levelPromise])
    if (realLevel?._id) user.level = realLevel._id

    // Update Login Info
    user.login.update = now
    user.login.last_ip = IP as string

    // Lưu dưới dạng chạy các tác vụ phụ song song
    await Promise.all([
      user.save(),
      loginUpsertPromise,
      lunarBonusPromise,
    ])

    // Result
    const userStore : IDBUserStore = {
      _id: user._id,
      username: user.username,
      level: realLevel,
      vip: user.vip,
      type: user.type,
      referral_code: user.referral.code,
      currency: user.currency
    }

    return resp(event, { result: userStore })
  } 
  catch (e:any) {
    return resp(event, { code: 401, message: e.toString() })
  }
})