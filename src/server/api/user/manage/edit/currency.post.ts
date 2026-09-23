import type { IAuth, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'user.editCurrency')

    const { _id, type, plus, origin, reason } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'
    if(type != 'plus' && type != 'origin') throw 'Kiểu chỉnh sửa không hợp lệ'
    if(!reason) throw 'Vui lòng nhập lý do'

    const user = await DB.User.findOne({_id: _id}).select('username type currency') as IDBUser
    if(!user) throw 'Người dùng không tồn tại'

    if(type == 'plus'){
      if(
        !!isNaN(parseInt(plus.coin)) 
        || !!isNaN(parseInt(plus.wheel))
        || !!isNaN(parseInt(plus.diamond)) 
      ) throw 'Dữ liệu tiền tệ không hợp lệ'

      const update : any = {}
      update['$inc'] = {
        'currency.coin': parseInt(plus.coin), 
        'currency.wheel': parseInt(plus.wheel),
        'currency.diamond': parseInt(plus.diamond)
      }

      const change = []
      if(parseInt(plus.coin) > 0){
        change.push(`${plus.coin.toLocaleString('vi-VN')} xu`)
      }
      if(parseInt(plus.wheel) > 0){
        change.push(`${plus.wheel.toLocaleString('vi-VN')} lượt quay`)
      }
      if(parseInt(plus.diamond) > 0){
        change.push(`${plus.diamond.toLocaleString('vi-VN')} cống hiến`)
      }

      if(change.length > 0){
        const userUpdate = await DB.User.findOneAndUpdate({ _id: _id }, update, { new: true }).select('currency') as IDBUser
        if(userUpdate.currency.coin < 0) userUpdate.currency.coin = 0
        if(userUpdate.currency.wheel < 0) userUpdate.currency.wheel = 0
        if(userUpdate.currency.diamond < 0) userUpdate.currency.diamond = 0
        await userUpdate.save()

        await logUser(event, user._id, `Nhận <b>${change.join(', ')}</b> từ quản trị viên <b>${auth.username}</b> với lý do <b>${reason}</b>`)
        await logAdmin(event, `Thêm <b>${change.join(', ')}</b> cho tài khoản <b>${user.username}</b> với lý do <b>${reason}</b>`)
      }
    }

    if(type == 'origin'){
      if(
        !!isNaN(parseInt(origin.coin)) 
        || !!isNaN(parseInt(origin.wheel))
        || !!isNaN(parseInt(origin.diamond))
        || parseInt(origin.coin) < 0
        || parseInt(origin.wheel) < 0
        || parseInt(origin.diamond) < 0
      ) throw 'Dữ liệu tiền tệ không hợp lệ'

      const update : any = {}
      update['currency'] = origin
      
      const change = []
      
      if(origin.coin != user.currency.coin){
        change.push('xu')
        await logUser(event, user._id, `Số <b>xu</b> được thay đổi từ <b>${user.currency.coin.toLocaleString('vi-VN')}</b> thành <b>${origin.coin.toLocaleString('vi-VN')}</b> bởi quản trị viên <b>${auth.username}</b> với lý do <b>${reason}</b>`)
      }
      if(origin.wheel != user.currency.wheel){
        change.push('lượt quay')
        await logUser(event, user._id, `Số <b>lượt quay</b> được thay đổi từ <b>${user.currency.wheel.toLocaleString('vi-VN')}</b> thành <b>${origin.wheel.toLocaleString('vi-VN')}</b> bởi quản trị viên <b>${auth.username}</b> với lý do <b>${reason}</b>`)
      }
      if(origin.diamond != user.currency.diamond){
        change.push('cống hiến')
        await logUser(event, user._id, `Số <b>cống hiến</b> được thay đổi từ <b>${user.currency.diamond.toLocaleString('vi-VN')}</b> thành <b>${origin.diamond.toLocaleString('vi-VN')}</b> bởi quản trị viên <b>${auth.username}</b> với lý do <b>${reason}</b>`)
      }

      if(change.length > 0){
        const userUpdate = await DB.User.findOneAndUpdate({ _id: _id }, update, { new: true }).select('currency') as IDBUser
        if(userUpdate.currency.coin < 0) userUpdate.currency.coin = 0
        if(userUpdate.currency.wheel < 0) userUpdate.currency.wheel = 0
        if(userUpdate.currency.diamond < 0) userUpdate.currency.diamond = 0
        await userUpdate.save()

        await logAdmin(event, `Sửa dữ liệu <b>${change.join(', ')}</b> của tài khoản <b>${user.username}</b> với lý do <b>${reason}</b>`)
      }
    }

    !!IO && IO.to(user._id.toString()).emit('auth-update')
    return resp(event, { message: 'Sửa tiền tệ thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})