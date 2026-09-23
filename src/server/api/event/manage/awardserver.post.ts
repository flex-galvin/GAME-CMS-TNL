import type { IAuth, IDBEventConfig, IDBEvent } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'event.edit')

    const body = await readBody(event)
    const { _id, awardserver } = body
    if(!_id || !awardserver) throw 'Dữ liệu đầu vào không hợp lệ'

    const eventData = await DB.Event.findOne({ _id: _id }).select('need type') as IDBEvent
    if(!eventData) throw 'Dữ liệu mốc thưởng không tồn tại'

    const eventConfig = await DB.EventConfig.findOne({ type: eventData.type }).select('name') as IDBEventConfig
    if(!eventConfig) throw 'Kiểu sự kiện không hỗ trợ'

    const awardserverFormat = awardserver.map((i : any) => ({
      servers: i.servers,
      gift: i.gift.map((o : any) => ({ item: o.item._id, amount: o.amount }))
    }))

    await DB.Event.updateOne({ _id: _id }, { awardserver: awardserverFormat })

    await logAdmin(event, `Cập nhật phần thưởng riêng từng máy chủ cho mốc <b>${eventData.need}</b> cho sự kiện <b>${eventConfig.name}</b>`)
    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})