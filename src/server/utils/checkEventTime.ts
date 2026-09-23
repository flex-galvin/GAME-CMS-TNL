import type { IDBEventConfig } from '~~/types'

export default async (key : string) : Promise<boolean> => {
  try {
    const event = await DB.EventConfig.findOne({ type: key }).select('start end') as IDBEventConfig
    if(!event) return Promise.resolve(false)
    const now = dayjs().unix()
    
    if(!!event.start && !!event.end){
      const start = dayjs(event.start).unix()
      const end = dayjs(event.end).unix()
      if(start <= now && now < end) return Promise.resolve(true)
      else return Promise.resolve(false)
    }

    if(!!event.start && !event.end){
      const start = dayjs(event.start).unix()
      if(now >= start) return Promise.resolve(true)
      else return Promise.resolve(false)
    }

    if(!event.start && !!event.end){
      const end = dayjs(event.end).unix()
      if(now < end) return Promise.resolve(true)
      else return Promise.resolve(false)
    }

    return Promise.resolve(true)
  }
  catch(e){
    return Promise.resolve(false)
  }
}