import { Types } from "mongoose"
import { IAuth, IDBUser, IDBItem } from "~~/types"
import type { H3Event } from 'h3'

interface ISender {
  user: { _id: Types.ObjectId, username: string }
  server: { server_id: string, server_name: string }
  role: { role_id: string, role_name: string }
}

interface IMail {
  title: string | undefined
  content: string | undefined
  giftItem: { id: string; amount: number }[]
  giftCurrency: Record<string, number>
  reason: string | undefined
  itemLog : any[]
}

interface IBodyItem {
  item: IDBItem
  amount: number
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const sendOne = async (event: H3Event, auth: IAuth, sender : ISender, mail: IMail) => {
  try {
    const { title, content, giftItem, giftCurrency, reason, itemLog } = mail

    const user = await DB.User.findById(sender.user._id).select('username') as IDBUser
    if(!user) throw 'Tài khoản không tồn tại'

    // Send Gift
    await gameSendMail(event, {
      account: user.username,
      server_id: sender.server.server_id,
      role_id: sender.role.role_id,
      title: title || 'GM Send',
      content: content || 'Vật phẩm gửi từ GM',
      items: giftItem.length > 0 ? giftItem : []
    })
    if(Object.keys(giftCurrency).length){
      await DB.User.updateOne({ _id: user._id }, {  $inc: giftCurrency })
      IO?.to(user._id.toString()).emit('auth-update')
    }
    
    // Save Log
    await Promise.allSettled([
      DB.LogAdminSendItem.create({
        from: auth._id,
        to: user._id,
        server: sender.server.server_id,
        role: sender.role.role_id,
        reason: reason,
        gift: itemLog
      }),
      logUser(event, user._id, `Nhận <b>vật phẩm</b> từ quản trị viên <b>${auth.username}</b> với lý do <b>${reason}</b>`),
      logAdmin(event, `Gửi vật phẩm cho <b>${user.username}</b> tại máy chủ <b>${sender.server.server_id}</b> với lý do <b>${reason}</b>`),
    ])

    IO && IO.to(auth._id.toString()).emit('manage-send-multiple-success', sender)
  }
  catch(e: any){
    IO && IO.to(auth._id.toString()).emit('manage-send-multiple-error', {
      reason: e.toString(),
      ...sender
    })
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'game.sendItem')

    const { roles, title, content, reason, items } = body as {
      roles: ISender[]
      title?: string
      content?: string
      reason: string
      items: IBodyItem[]
    }

    if(!Array.isArray(roles) || !reason || !Array.isArray(items)) throw 'Dữ liệu đầu vào không hợp lệ'
    // if(items.length < 1) throw 'Dữ liệu vật phẩm không hợp lệ'
    if(roles.length < 1) throw 'Dữ liệu nhân vật không hợp lệ'

    // Format Gift
    const giftItem: { id: string; amount: number }[] = []
    const giftCurrency: Record<string, number> = {}
    const itemLog : any[] = []
    for (const { item, amount } of items) {
      itemLog.push({ item: item._id, amount })

      if (item.type === 'game_item') {
        giftItem.push({ id: item.item_id, amount })
        continue
      }
      if (item.type === 'coin' || item.type === 'wheel') {
        giftCurrency[`currency.${item.type}`] = (giftCurrency[`currency.${item.type}`] || 0) + amount
      }
    }

    // Send
    const BATCH_SIZE = 5
    const MIN_DELAY_MS = 1000
    const MAX_DELAY_MS = 2000

    for (let i = 0; i < roles.length; i += BATCH_SIZE) {
      const batch = roles.slice(i, i + BATCH_SIZE)
      await Promise.allSettled(
        batch.map((sender: ISender) =>
          sendOne(event, auth, sender, {
            title,
            content,
            giftItem,
            giftCurrency,
            reason,
            itemLog
          })
        )
      )

      // Delay giữa các đợt (trừ đợt cuối)
      if (i + BATCH_SIZE < roles.length) {
        const delay = Math.floor(MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS))
        await sleep(delay)
      }
    }

    return resp(event, { message: 'Tiến trình đã hoàn thành' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})