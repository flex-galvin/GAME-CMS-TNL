import type { IAuth, IDBUser } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'user.reset')

    const { type, user : _id } = await readBody(event)
    const match : any = {}
    const matchEgg : any = {}
    
    let user
    if(!!_id){
      user = await DB.User.findOne({ _id: _id }).select('username') as IDBUser
      if(!user) throw 'Tài khoản không tồn tại'
      match['_id'] = { $in: [ user._id ] }
      matchEgg['user'] = { $in: [ user._id ] }
    }

    if(type == 'currency'){
      await DB.User.updateMany(match, { 
        'currency.coin' : 0, 
        'currency.wheel': 0,
        'currency.diamond': 0,
      })
      if(!user) await logAdmin(event, 'Reset <b>tiền tệ</b> tất cả tài khoản')
      else await logAdmin(event, `Reset <b>tiền tệ</b> của tài khoản <b>${user.username}</b>`)
    }

    if(type == 'pay.day'){
      await DB.User.updateMany(match, { 'pay.day.money' : 0 })
      if(!user) await logAdmin(event, 'Reset <b>tích nạp ngày</b> tất cả tài khoản')
      else await logAdmin(event, `Reset <b>tích nạp ngày</b> của tài khoản <b>${user.username}</b>`)
    }
    if(type == 'pay.month'){
      await DB.User.updateMany(match, { 'pay.month.money' : 0 })
      if(!user) await logAdmin(event, 'Reset <b>tích nạp tháng</b> tất cả tài khoản')
      else await logAdmin(event, `Reset <b>tích nạp tháng</b> của tài khoản <b>${user.username}</b>`)
    }
    if(type == 'pay.total'){
      await DB.User.updateMany(match, { 'pay.total.money' : 0})
      if(!user) await logAdmin(event, 'Reset <b>tích nạp tổng</b> tất cả tài khoản')
      else await logAdmin(event, `Reset <b>tích nạp tổng</b> của tài khoản <b>${user.username}</b>`)
    }
    if(type == 'spend.day'){
      await DB.User.updateMany(match, { 'spend.day.coin' : 0 })
      if(!user) await logAdmin(event, 'Reset <b>tiêu phí ngày</b> tất cả tài khoản')
      else await logAdmin(event, `Reset <b>tiêu phí ngày</b> của tài khoản <b>${user.username}</b>`)
    }
    if(type == 'spend.month'){
      await DB.User.updateMany(match, { 'spend.month.coin' : 0 })
      if(!user) await logAdmin(event, 'Reset <b>tiêu phí tháng</b> tất cả tài khoản')
      else await logAdmin(event, `Reset <b>tiêu phí tháng</b> của tài khoản <b>${user.username}</b>`)
    }
    if(type == 'spend.total'){
      await DB.User.updateMany(match, { 'spend.total.coin' : 0 })
      if(!user) await logAdmin(event, 'Reset <b>tiêu phí tổng</b> tất cả tài khoản')
      else await logAdmin(event, `Reset <b>tiêu phí tổng</b> của tài khoản <b>${user.username}</b>`)
    }

    if(type == 'login.month'){
      await DB.User.updateMany(match, { 
        'login.month' : 1,
        'login.update': null
      })
      await DB.UserLogin.deleteMany(match)
      if(!user) await logAdmin(event, 'Reset <b>đăng nhập tháng</b> tất cả tài khoản')
      else await logAdmin(event, `Reset <b>đăng nhập tháng</b> của tài khoản <b>${user.username}</b>`)
    }
    if(type == 'login.total'){
      await DB.User.updateMany(match, { 
        'login.month' : 1, 
        'login.total': 1,
        'login.update': null
      })
      await DB.UserLogin.deleteMany(match)
      if(!user) await logAdmin(event, 'Reset <b>đăng nhập tổng</b> tất cả tài khoản')
      else await logAdmin(event, `Reset <b>đăng nhập tổng</b> của tài khoản <b>${user.username}</b>`)
    }
    if(type == 'egg'){
      await DB.EggUser.deleteMany(matchEgg)
      if(!user) await logAdmin(event, 'Reset <b>tháp trứng</b> của tất cả tài khoản')
      else await logAdmin(event, `Reset <b>tháp trứng</b> của tài khoản <b>${user.username}</b>`)
    }
    if(type == 'paydays'){
      await DB.User.updateMany(match, { 'paydays.day': 0, 'paydays.receive': 0 })
      if(!user) await logAdmin(event, 'Reset <b>nạp đơn</b> của tất cả tài khoản')
      else await logAdmin(event, `Reset <b>nạp đơn</b> của tài khoản <b>${user.username}</b>`)
    }
    if(type == 'paymusty'){
      await DB.User.updateMany(match, { 'paymusty' : [] })
      if(!user) await logAdmin(event, 'Reset <b>liên nạp</b> của tất cả tài khoản')
      else await logAdmin(event, `Reset <b>liên nạp</b> của tài khoản <b>${user.username}</b>`)
    }
    
    return resp(event, { message: 'Thao tác thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})