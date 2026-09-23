import type { IDBUser, IDBGiftcode, IDBItem } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const { account, server, role, code } = await readBody(event)
    if(!account) throw 'Không tìm thấy thông tin tài khoản'
    if(!code) throw 'Không tìm thấy mã giftcode'
    if(!server) throw 'Không tìm thấy ID máy chủ'
    if(!role) throw 'Không tìm thấy ID nhân vật'

    // Check User
    const user = await DB.User.findOne({ username: account }).select('username') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'

    // Giftcode
    const giftcode = await DB.Giftcode
    .findOne({ code: code, display: 1 })
    .populate({ path: 'gift.item', select: 'item_id type' })
    .select('-createdAt -updateAt -display') as IDBGiftcode

    // Check Giftcode
    if(!giftcode) throw 'Mã không tồn tại'
    if(giftcode.gift.length == 0) throw 'Mã chưa có phần thưởng để nhận'

    // Check Servers
    const servers = giftcode.servers
    if(servers.length > 0){
      const hasServer = servers.findLastIndex(i => i == server)
      if(hasServer == -1) throw 'Mã không áp dụng cho máy chủ này'
    }

    // Check Users
    const users = giftcode.users
    if(users.length > 0){
      const hasUser = users.findLastIndex(i => i.toString() == user._id.toString())
      if(hasUser == -1) throw 'Mã không áp dụng cho tài khoản của bạn'
    }

    // Check Time
    if(giftcode.expired){
      const now = dayjs().unix()
      const expired = dayjs(giftcode.expired).unix()
      if(now > expired) throw 'Mã đã hết hạn sử dụng'
    }
    
    // Check Limit
    if(giftcode.limit > 0){
      const countReceive = await DB.GiftcodeHistory.count({ giftcode: giftcode._id })
      if(countReceive >= giftcode.limit) throw 'Mã này đã hết lượt sử dụng'
    }

    // Check Use
    if(!giftcode.justone){
      const countReceiveAuth = await DB.GiftcodeHistory.count({ user: user._id, giftcode: giftcode._id, server: server, role: role })
      if(countReceiveAuth > 0) throw 'Bạn đã nhận mã này cho nhân vật ở máy chủ này rồi'
    }
    else {
      const countReceiveAuth = await DB.GiftcodeHistory.count({ user: user._id, giftcode: giftcode._id })
      if(countReceiveAuth > 0) throw 'Mã này chỉ được dùng 1 lần duy nhất'
    }
    

    // Format Gift
    const giftItem : Array<any> = []
    const giftCurrency : any = {}

    giftcode.gift.forEach(gift => {
      const item = gift.item as IDBItem

      if(item.type == 'game_item'){
        giftItem.push({ id: item.item_id, amount: gift.amount })
      }
      if(!!['coin', 'wheel'].includes(item.type)){
        giftCurrency[`currency.${item.type}`] = gift.amount
      }
    })

    // Send Gift
    if(giftItem.length > 0){
      await gameSendMail(event, {
        account: user.username,
        server_id: server,
        role_id: role,
        title: 'Web Giftcode',
        content: 'Vật phẩm nhận từ Giftcode trên Web',
        items: giftItem
      })
    }
      
    if(Object.keys(giftCurrency).length) await DB.User.updateOne({ _id: user._id },{ $inc: giftCurrency })

    // History
    await DB.GiftcodeHistory.create({
      user: user._id,
      giftcode: giftcode._id,
      server: server,
      role: role
    })
    await DB.User.updateOne({ _id: user._id }, { 'action.giftcode': false })

    // Log User
    await logUser(event, user._id, `Sử dụng giftcode <b>${giftcode.code}</b> tại máy chủ <b>${server}</b> nhân vật <b>${role}</b>`)
    return resp(event, { message: 'Nhận thưởng thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})