import type { IAuth, IDBLevel, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const { _id } = await readBody(event)

    const auth = await getAuth(event, false) as IAuth | null
    const select = ['username', 'avatar', 'level', 'vip', 'type']
    if(!!auth && (auth.type > 0 || auth._id.toString() == _id.toString())){
      select.push(...['currency', 'email', 'phone', 'block', 'referral', 'pay', 'spend', 'login', 'paymusty', 'paydays'])
    }

    const data = await DB.User
    .findOne({ _id: _id })
    .select(select.join(' '))
    .populate({ path: 'level', select: 'number title need'}) as IDBUser
    if(!data) throw 'Không tìm thấy thông tin tài khoản'

    const user = JSON.parse(JSON.stringify(data))
    const level = { now: user.level, next: null }
    delete user['level']
    user.level = level

    if(!!user.level.now){
      const next = await DB.Level
      .findOne({ number: (user.level.now as IDBLevel).number + 1 })
      .select('number title need') as IDBLevel
      if(!!next) user.level.next = next
    }

    if(!!user.phone && (!auth || (!!auth && auth.type < 1))){
      const fullNumber = user.phone
      const last4Digits = fullNumber.slice(-2)
      user.phone = last4Digits.padStart(fullNumber.length, '*')
    }

    if(!!user.email && (!auth || (!!auth && auth.type < 1))){
      const [mail, domain] = user.email.split('@')
      if (user.length <= 3) user.email = mail[0] + '*@' + domain
      else {
        const first = mail[0]
        const last2 = mail.slice(-2)
        const middle = '*'.repeat(Math.max(1, mail.length - 3))
        user.email = `${first}${middle}${last2}@${domain}`
      }
    }

    return resp(event, { result: user })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})