import type { IAuth, IDBGameRankProcess } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'event.edit')

    const body = await readBody(event)
    const { _id, award } = body
    if(!_id || !award) throw 'Dữ liệu đầu vào không hợp lệ'

    const processEvent = await DB.GameRankProcess.findOne({ _id: _id }).select('server type') as IDBGameRankProcess
    if(!processEvent) throw 'Tiến trình không tồn tại'

    const formatAward = award.map((i : any) => ({
      rank: i.rank,
      gift: i.gift.map((data : any) => ({
        item: data.item._id,
        amount: data.amount
      }))
    }))

    await DB.GameRankProcess.updateOne({ _id: processEvent._id }, { award: formatAward })

    await logAdmin(event, `Sửa phần thưởng trả quà đua <b>TOP ${processEvent.type == 'power' ? 'lực chiến' : 'cấp độ'}</b> của máy chủ <b>${processEvent.server}</b>`)
    return resp(event, { message: 'Sửa thành công' })
  }
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})