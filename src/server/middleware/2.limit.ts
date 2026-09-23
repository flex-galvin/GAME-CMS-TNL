import { getRequestIP, sendError, createError } from 'h3'

const MAX_REQUESTS = 100
const WINDOW_SEC = 10

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const cloudfire = runtimeConfig.cloudfire

  // Không tìm thấy Redis hoặc bật Cloudfire, bỏ giới hạn
  if (!DBRedis || !!cloudfire) return 

  // Bật giới hạn khi máy chủ Redis được kết nối
  const PREFIX = runtimeConfig.redisPREFIX || 'default'
  const ip = getRequestIP(event, { xForwardedFor: true }) || 'unknown'
  const key = `${PREFIX}:ratelimit:${ip}`
  const count = await DBRedis!.incr(key)
  if (count === 1) await DBRedis!.expire(key, WINDOW_SEC)
  if (count > MAX_REQUESTS) {
    const ttl = await DBRedis!.ttl(key)
    const timeLeft = ttl > 0 ? ttl : WINDOW_SEC

    return sendError(
      event,
      createError({
        statusCode: 429,
        statusMessage: `Vui lòng thử lại sau ${timeLeft}s.`,
        data: {
          retryAfter: timeLeft,
          message: `Hãy chờ ${timeLeft}s rồi thử lại`,
        }
      })
    )
  }
})