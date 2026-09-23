import type { IAuth, IDBConfig } from "~~/types"
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const auth = await getAuth(event) as IAuth

    const config = await DB.Config.findOne().select('game enable.play') as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình trò chơi'
    if(!config.game.api.start) throw 'Trò chơi đang bảo trì'
    if(auth.type < 1 && !config.enable.play) throw 'Trò chơi đang bảo trì'

    const url = await gameStart(event, auth.username)
    const token = jwt.sign({ url : url }, runtimeConfig.apiSecret, { expiresIn: '360d' })
    
    return resp(event, { result: token })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})