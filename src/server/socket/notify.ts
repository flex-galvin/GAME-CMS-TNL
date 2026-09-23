import { Types } from 'mongoose'
import type { Server as SocketServer, Socket } from 'socket.io'

export default (io : SocketServer, socket : Socket) => {
  socket.on('notify-single-new', async () => { 
    try {
      if(!socket.authID) throw 'Bạn chưa đăng nhập'

      const result = await DB.LogUser.count({ user: new Types.ObjectId(socket.authID), watched: false })

      socket.emit('notify-single-new', result)
    }
    catch(e:any) {
      return
    }
  })
}