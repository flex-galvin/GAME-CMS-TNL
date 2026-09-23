import type { Server as SocketServer, Socket } from 'socket.io'
import type { IDBUser } from "~~/types"

export default (io : SocketServer, socket : Socket) => {
  // Chat Global
  socket.on('chat-global-send', async (data) => { 
    try {
      if(!socket.authID) throw 'Bạn chưa đăng nhập'
      const { text } = data
      if(!text) throw 'Vui lòng nhập nội dung'
      if(text.length > 100) throw 'Nội dung không vượt quá 100 ký tự'

      // Get User
      const user = await DB.User
      .findOne({ _id: socket.authID })
      .select('username level avatar type')
      .populate({ path: 'level',  select: 'number title' }) as IDBUser
      if(!user) throw 'Tài khoản không tồn tại'

      // Check Tag
      const match = text.match(/^@(\S+)/)

      // Default Chat
      if(!match){
        const chat = await DB.SocketChat.create({
          user: user._id,
          text: text,
          type: 'message'
        })
        const result = JSON.parse(JSON.stringify(chat))
        result.user = user

        return io.emit('chat-global-push', result)
      }

      // Smart Chat
      if(match[1] == 'all'){
        if(user.type < 1) throw 'Chức năng chỉ dành cho Quản Trị Viên'

        const notifyArr = text.split("@all ")
        if(!notifyArr[1]) throw 'Vui lòng nhập nội dung thông báo'

        sendNotifyRunning(user, `lên tiếng【${notifyArr[1]}】`)
      }
    }
    catch(e:any) {
      socket.emit('chat-global-send-error', { message: e.toString() })
    }
  })
}