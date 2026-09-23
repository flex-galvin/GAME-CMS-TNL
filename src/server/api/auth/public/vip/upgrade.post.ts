import type { IAuth, IDBConfig, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const { type, times } = await readBody(event)
    if(!type) throw 'Không tìm thấy loại nâng cấp'
    if(!['day', 'forever'].includes(type)) throw 'Loại nâng cấp không hỗ trợ'
    if(!times) throw 'Không tìm thấy thời hạn mua'
    if(!['week', 'month', 'forever'].includes(times)) throw 'Thời hạn mua không hỗ trợ'
    if(type == 'forever' || times == 'forever') throw 'Tài khoản không hỗ trợ nâng VIP vĩnh viễn'

    const config = await DB.Config.findOne().select('vip menu') as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình trang'
    if(!config.menu.action.vip) throw 'Tính năng đang bảo trì'
  
    const user = await DB.User.findOne({ _id: auth._id }).select('vip currency') as IDBUser
    if(!user) throw 'Tài khoản không tồn tại'
    if(user.vip.type == 'forever') throw 'Bạn đã nâng cấp lên đặc quyền VIP Trọn Đời, không thể nâng cấp thêm'

    // @ts-expect-error
    const price = config.vip.price[times]
    if(!price) throw 'Không tìm thấy só tiền phải thanh toán'
    if(user.currency.coin < price) throw 'Số dư xu không đủ để thanh toán'

    // VIP vĩnh viễn
    if(type == 'forever'){
     await DB.User.updateOne({ _id: user._id }, {
        $set: {
          'vip.enable': true,
          'vip.end': null,
          'vip.type': 'forever',
        },
        $inc: {
          'currency.coin': parseInt(price) * -1
        }
      })
      await logUser(event, user._id, `Nâng cấp tài khoản lên VIP Vĩnh Viễn`)
    }

    // VIP ngày
    if(type == 'day'){
      const add = times == 'week' ? 7 : (times == 'month' ? 30 : 0)
      if(!add) throw 'Lỗi hệ thông phân ngày'

      const now = dayjs(user.vip.end || Date.now())
      user.vip.enable = true
      user.vip.end = now.add(add, 'day').toDate()
      user.vip.type = 'day'

      await DB.User.updateOne({ _id: user._id }, {
        $set: {
          'vip.enable': true,
          'vip.end': now.add(add, 'day').toDate(),
          'vip.type': 'day',
        },
        $inc: {
          'currency.coin': parseInt(price) * -1
        }
      })
      await logUser(event, user._id, `Gia hạn VIP tài khoản thêm ${add} ngày`)
    }

    !!IO && IO.to(auth._id.toString()).emit('auth-update')
    return resp(event, { message: 'Nâng cấp thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})