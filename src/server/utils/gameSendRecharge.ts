import type { H3Event } from 'h3'
import type { IDBConfig } from '~~/types'
import axios from 'axios'

interface ISendData {
  account: string
  server_id: string
  role_id: string
  recharge_id: string
  save_pay: number
}

export default async (event: H3Event, data : ISendData) : Promise<void> => {
  try {
    const config = await DB.Config.findOne().select('game') as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình trò chơi'
    if(!config.game.api.recharge) throw 'Tính năng gửi gói nạp vào trò chơi đang bảo trì'

    const send = await axios.post(config.game.api.recharge, {
      secret: config.game.secret,
      ...data
    },{
      timeout: 10_000
    })
    const res = send.data
    if(res.error) throw res.error

    !!IO && IO.emit('recharge-done', data)
  }
  catch (e:any) {
    if (axios.isAxiosError(e) && e.code === 'ECONNABORTED') {
      throw 'Quá thời gian gọi API cho phép'
    }
    throw e.toString()
  }
}