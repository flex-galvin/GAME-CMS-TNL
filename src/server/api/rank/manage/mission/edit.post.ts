import type { IAuth, IDBGameMission } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'event.edit')

    const body = await readBody(event)
    const { _id, need, gift } = body
    if(!_id || !need || !gift) throw 'Dữ liệu đầu vào không hợp lệ'

    const mission = await DB.GameMission.findOne({ _id: _id }).select('need server type') as IDBGameMission
    if(!mission) throw 'Nhiệm vụ không tồn tại'

    if(mission.need != need){
      const getByNeed = await DB.GameMission.findOne({ server: mission.server, type: mission.type, need: need }).select('_id') as IDBGameMission
      if(!!getByNeed) throw 'Mốc thưởng nhiệm vụ đã tồn tại'
    }

    delete body['_id']
    const giftFormat = gift.map((i : any) => ({ item: i.item._id, amount: i.amount }))
    body.gift = giftFormat
    await DB.GameMission.updateOne({ _id: _id }, body)

    await logAdmin(event, `Sửa nhiệm vụ đạt <b>${mission.type == 'level' ? 'cấp' : 'lực chiến'} ${mission.need}</b> của máy chủ <b>${mission.server}</b>`)
    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})