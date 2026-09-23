import type { IAuth, IDBGameMission } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'event.del')

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const mission = await DB.GameMission.findOne({ _id: _id }).select('need server type') as IDBGameMission
    if(!mission) throw 'Nhiệm vụ không tồn tại'

    await DB.GameMissionHistory.deleteMany({ mission: mission._id })
    await DB.GameMission.deleteOne({ _id: mission._id })
    
    await logAdmin(event, `Xóa nhiệm vụ đạt <b>${mission.type == 'level' ? 'cấp' : 'lực chiến'} ${mission.need}</b> của máy chủ <b>${mission.server}</b>`)
    return resp(event, { message: 'Xóa thành công' })
  }
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})