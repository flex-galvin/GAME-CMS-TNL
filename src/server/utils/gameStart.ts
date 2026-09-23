import type { H3Event } from 'h3'
import type { IDBConfig } from '~~/types'
import axios from 'axios'

export default async (event: H3Event, account : string) : Promise<any> => {
  try {
    const config = await DB.Config.findOne().select('game') as IDBConfig

    const send = await axios.post(config.game.api.start, {
      secret: config.game.secret,
      account: account
    },{
      timeout: 10_000
    })
    const res = send.data
    if(res.error) throw res.error
    
    return Promise.resolve(res.data)
  }
  catch (e:any) {
    if (axios.isAxiosError(e) && e.code === 'ECONNABORTED') {
      throw 'Quá thời gian gọi API cho phép'
    }
    throw e.toString()
  }
}