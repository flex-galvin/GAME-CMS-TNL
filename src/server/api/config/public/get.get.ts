import { IDBConfig } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const REDIS_KEY = `${runtimeConfig.redisPREFIX || 'default'}:config:public`
    const REDIS_TTL = 24 * 60 * 60 // 24h

    // Cố gắng lấy từ Redis trước
    if(DBRedis){
      const cached = await DBRedis.get(REDIS_KEY)
      if(!!cached) return resp(event, { result: JSON.parse(cached) })
    }

    // Nếu không có trong Redis, lấy từ cơ sở dữ liệu
    const config = await DB.Config
    .findOne()
    .select(`
      -gm_password
      -about -privacy -terms 
      -game.api -game.secret
      -facebook.client_secret 
      -zalo.client_secret 
      -tiktok.client_secret
      -google.client_secret
      -telegram
      -cloudflare.secret_key
      -permission
      -notiruning.access
      -notiruning.pay
    `)
    .populate({ path: 'vip.gift.item', select: 'item_id item_name item_image type' }) as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình trang'

    // Lưu vào Redis để cache
    DBRedis && await DBRedis.set(REDIS_KEY, JSON.stringify(config), 'EX', REDIS_TTL)
    
    return resp(event, { result: config })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})