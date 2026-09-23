import type { IAuth, IDBGameMission } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'event.add')

    const body = await readBody(event)
    const { server, type, need, gift } = body
    if(!server || !type || !need || !gift) throw 'Dữ liệu đầu vào không hợp lệ'

    const getByNeed = await DB.GameMission.findOne({ server: server, type: type, need: need }).select('_id') as IDBGameMission
    if(!!getByNeed) throw 'Mốc thưởng nhiệm vụ đã tồn tại'

    const giftFormat = gift.map((i : any) => ({ item: i.item._id, amount: i.amount}))
    body.gift = giftFormat

    await DB.GameMission.create(body)
    await logAdmin(event, `Thêm nhiệm vụ đạt <b>${type == 'level' ? 'cấp' : 'lực chiến'} ${need}</b> cho máy chủ <b>${server}</b>`)
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})