import { IDBAdsLanding, IDBConfig } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const REDIS_KEY = `${runtimeConfig.redisPREFIX || 'default'}:config:home`
    const REDIS_TTL = 24 * 60 * 60 // 24h

    // Cố gắng lấy từ Redis trước
    if(DBRedis){
      const cached = await DBRedis.get(REDIS_KEY)
      if(!!cached) return resp(event, { result: cached == '/' ? null : cached })
    }

    // Nếu không có trong Redis, lấy từ cơ sở dữ liệu
    let homeURL = '/'
    const config = await DB.Config.findOne().select('enable homepage') as IDBConfig
    if(!!config.enable.landing && !!config.homepage.landing){
      const landing = await DB.AdsLanding.findOne({ _id: config.homepage.landing }) as IDBAdsLanding
      if(!!landing) homeURL = `/ads/${landing.code}`
    }

    // Lưu vào Redis để cache
    DBRedis && await DBRedis.set(REDIS_KEY, homeURL, 'EX', REDIS_TTL)

    return resp(event, { result: homeURL == '/' ? null : homeURL })
  } 
  catch (e:any) {
    return resp(event, { result: null })
  }
})