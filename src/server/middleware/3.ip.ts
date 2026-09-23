import { getRequestIP, sendError, createError } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const IP = getRequestIP(event, { xForwardedFor: true })
    const IPBlock = await DB.LogBlockIP.findOne({ ip: IP }).select('_id')
    if(!!IPBlock) throw 'Bạn bị chặn quyền truy cập'
  }
  catch (e:any) {
    return sendError(
      event,
      createError({
        statusCode: 511,
        statusMessage: e.toString(),
        data: {
          retryAfter: 999999999,
          message: e.toString(),
        },
      })
    )
  }
})