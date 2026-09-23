import type { IAuth, IDBGameRankProcess } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'

    const body = await readBody(event)
    const { fetchID } = body
    if(!fetchID) throw 'Không tìm thấy ID tiến trình'

    const processEvent = await DB.GameRankProcess.findOne({ _id: fetchID }).select('server type') as IDBGameRankProcess
    if(!processEvent) throw 'Tiến trình không tồn tại'

    let list : any = []
    if(processEvent.type == 'power') list = await gameGetRankPower(event, { server_id: processEvent.server })
    else list = await gameGetRankLevel(event, { server_id: processEvent.server })

    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})