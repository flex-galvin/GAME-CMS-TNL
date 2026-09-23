import axios from 'axios'

interface ISendData {
  url: string
  secret?: string
  message: string
}

export default async (data : ISendData) : Promise<boolean> => {
  try {
    if(!data.url || !data.message) throw 'Thiếu URL hoặc tin nhắn'

    await axios.post(data.url, {
      secret: 'zzg@222',
      message: data.message,
      mode: 'HTML'
    }, {
      timeout: 10_000
    })
    return true
  }
  catch (e:any) {
    if (axios.isAxiosError(e) && e.code === 'ECONNABORTED') {
      throw 'Quá thời gian gọi API cho phép'
    }
    throw e.toString()
  }
}