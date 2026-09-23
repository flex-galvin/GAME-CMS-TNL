import { IAuth, IDBUser, IDBItem } from "~~/types"

const currencyTypeList = [
  'coin', 'wheel'
]

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'game.sendItem')

    const { user, server, role, title, content, reason, items } = body
    if(!user || !server || !role || !reason || !Array.isArray(items)) throw 'Dữ liệu đầu vào không hợp lệ'
    // if(items.length < 1) throw 'Dữ liệu vật phẩm không hợp lệ'

    const userData = await DB.User.findOne({ _id: user }).select('_id username') as IDBUser
    if(!userData) throw 'Tài khoản không tồn tại'

    const itemLog = items.map((i : any) => ({
      item: i.item._id,
      amount: i.amount
    }))

    // Format Gift
    const giftItem : Array<any> = []
    const giftCurrency : any = {}
    items.forEach((gift : any) => {
      const item = gift.item as IDBItem

      if(item.type == 'game_item'){
        giftItem.push({ id: item.item_id, amount: gift.amount })
      }
      if(!!currencyTypeList.includes(item.type)){
        giftCurrency[`currency.${item.type}`] = gift.amount
      }
    })

    // Send Gift
    await gameSendMail(event, {
      account: userData.username,
      server_id: server,
      role_id: role,
      title: title || 'GM Send',
      content: content || 'Vật phẩm gửi từ GM',
      items: giftItem.length > 0 ? giftItem : []
    })
    if(Object.keys(giftCurrency).length){
      await DB.User.updateOne({ _id: userData._id }, {  $inc: giftCurrency })
      !!IO && IO.to(userData._id.toString()).emit('auth-update')
    }
    
    // Save Log
    await Promise.allSettled([
      DB.LogAdminSendItem.create({
        from: auth._id,
        to: userData._id,
        server: server,
        role: role,
        reason: reason,
        gift: itemLog
      }),
      logUser(event, userData._id, `Nhận <b>vật phẩm</b> từ quản trị viên <b>${auth.username}</b> với lý do <b>${reason}</b>`),
      logAdmin(event, `Gửi vật phẩm cho <b>${userData.username}</b> tại máy chủ <b>${server}</b> với lý do <b>${reason}</b>`)
    ])

    return resp(event, { message: 'Gửi thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})