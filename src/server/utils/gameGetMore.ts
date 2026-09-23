import type { H3Event } from 'h3'
import type { IDBConfig } from '~~/types'
import axios from 'axios'

export default async (event: H3Event) : Promise<any> => {
  try {
    const config = await DB.Config.findOne().select('more_game contact') as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình trò chơi'
    if(!config.more_game) throw 'Tính năng lấy thông tin các trò chơi khác đang bảo trì'

    const send = await axios.post(config.more_game, {
      code: config.contact.prefix
    },{
      timeout: 10_000
    })
    const res = send.data
    if(res.error) throw res.error
    
    return Promise.resolve(res.data || [])
  }
  catch (e:any) {
    if (axios.isAxiosError(e) && e.code === 'ECONNABORTED') {
      throw 'Quá thời gian gọi API cho phép'
    }
    throw e.toString()
  }
}