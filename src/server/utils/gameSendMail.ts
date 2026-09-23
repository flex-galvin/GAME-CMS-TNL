import type { H3Event } from 'h3'
import type { IDBConfig } from '~~/types'
import axios from 'axios'

interface ISendData {
  account: string
  server_id: string
  role_id: string
  title: string
  content: string
  items: Array<{
    id: string
    amount: number
  }>
}

export default async (event: H3Event | null, data : ISendData, throwError: boolean = true) : Promise<any> => {
  try {
    const config = await DB.Config.findOne().select('game') as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình trò chơi'
    if(!config.game.api.mail) throw 'Tính năng gửi thư vào trò chơi đang bảo trì'

    const send = await axios.post(config.game.api.mail, {
      secret: config.game.secret,
      ...data
    },{
      timeout: 10_000
    })
    const res = send.data
    if(res.error) throw res.error

    // !!IO && IO.emit('mail-done', data)
    return Promise.resolve(true)
  }
  catch (e:any) {
    if(!!throwError) {
      if (axios.isAxiosError(e) && e.code === 'ECONNABORTED') {
        throw 'Quá thời gian gọi API cho phép'
      }
      throw e.toString()
    }
    else return Promise.resolve(false)
  }
}