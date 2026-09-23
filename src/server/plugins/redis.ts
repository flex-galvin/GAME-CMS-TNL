import { createError } from 'h3'
import Redis from 'ioredis'

declare global {
  var DBRedis : Redis | null
}

export default defineNitroPlugin(async (nitroApp) => {
  const runtimeConfig = useRuntimeConfig()
  if(!runtimeConfig.dev){
    global.DBRedis = new Redis({
      host: runtimeConfig.redisHOST || '127.0.0.1',
      port: Number(runtimeConfig.redisPORT || 6379),
      db: Number(runtimeConfig.redisDB || 0),
      lazyConnect: true,
    })

    global.DBRedis.connect()
    .then(() => 
      console.log('[Redis] ✅ Kết nối thành công')
    )
    .catch(e => {
      throw createError({ 
        statusCode: 500,
        message: `[Redis] ❌ Lỗi kết nối: ${e.toString()}` 
      })
    })
  }
  else {
    global.DBRedis = null
  }
})
