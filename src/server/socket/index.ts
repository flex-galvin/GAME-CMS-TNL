import type { Server as SocketServer, Socket } from 'socket.io'
import OnlineAction from './online'
import ChatAction from './chat'
import NotifyAction from './notify'

const EMIT_LIMIT = 50               // Tối đa 50 emit/s
const RATE_WINDOW_MS = 5000         // Reset sau 5 giây (1000ms)

export default (io : SocketServer) => {
  const runtimeConfig = useRuntimeConfig()
  const cloudfire = runtimeConfig.cloudfire
  const PREFIX = runtimeConfig.redisPREFIX || 'default'

  io.on('connection', (socket : Socket) => {
    const socketKey = `${PREFIX}:socket:${socket.id}:count`

    // Không tìm thấy Redis hoặc bật Cloudfire, bỏ giới hạn
    if (!DBRedis || !!cloudfire) {
      OnlineAction(io, socket)
      ChatAction(io, socket)
      NotifyAction(io, socket)
      return
    }

    // Bật giới hạn khi máy chủ Redis được kết nối
    socket.onAny(async () => {
      const count = await DBRedis!.incr(socketKey)
      if (count === 1) await DBRedis!.pexpire(socketKey, RATE_WINDOW_MS)
      if (count > EMIT_LIMIT) socket.disconnect(true)
    })
    socket.on('disconnect', async () => {
      await DBRedis!.del(socketKey)
    })

    OnlineAction(io, socket)
    ChatAction(io, socket)
    NotifyAction(io, socket)
  })
}