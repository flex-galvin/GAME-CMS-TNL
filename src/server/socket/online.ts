import type { Server as SocketServer, Socket } from 'socket.io'
import type { Types } from 'mongoose'
import { IDBConfig, IDBUser } from '~~/types'

const sendOnline = async (io : SocketServer, socket? : Socket) => {
  const online = await DB.SocketOnline.aggregate([
    { $addFields: { user: { $cond: [{$not: ["$user"]}, '$socket', '$user']} }},
    { $group: { _id: '$user' }}
  ])
  io.emit('online', online.length)
}

export default async (io : SocketServer, socket : Socket) => {
  await DB.SocketOnline.create({ socket: socket.id })

  socket.on('online-join', async (id? : Types.ObjectId) => {
    try {
      if(!id) return sendOnline(io) // Là máy khách không đăng nhập
      
      // Lấy cấu hình trang
      const config = await DB.Config.findOne().select('notiruning') as IDBConfig
      if(!config) throw 'Không tìm thấy cấu hình trang'

      // Lấy thống tin User
      const user = await DB.User
      .findOne({ _id: id })
      .select('username level type')
      .populate({ path: 'level', select: 'number title' }) as IDBUser
      if(!user) throw 'Tài khoản không tồn tại'

      // Cập nhật lại Socket Data
      await DB.SocketOnline.findOneAndUpdate({ socket: socket.id }, { user: user._id }, { upsert: true })

      // Set User Channel
      socket.authID = user._id.toString()
      socket.join(socket.authID)

      // Gửi đến client của người đăng nhập để bắt đầu lấy các thông tin khác
      socket.emit('online-sign-in')

      // Gửi thông báo truy cập
      if(
        user.type >= config.notiruning.access.role || 
        (user.level && user.level.number >= config.notiruning.access.level)
      ) sendNotifyRunning(user, 'đã giáng lâm')

      // Cập nhật online tới toàn máy chủ      
      await sendOnline(io)
    }
    catch(e : any){
      return
    }
  })

  socket.on('online-logout', async () => {
    try {
      if(!socket.authID) throw true // Chưa đăng nhập, không làm gì cả

      // Cập nhật dữ liệu Socket
      await DB.SocketOnline.updateOne({ socket: socket.id }, { user: null })

      // Remove Auth User Channel
      !!socket.authID && socket.leave(socket.authID), socket.authID = null

      // Cập nhật online tới toàn máy chủ
      await sendOnline(io)
    }
    catch(e){
      return
    }
  })

  socket.on('disconnect', async () => {
    try {
      // Cập nhật dữ liệu Socket
      await DB.SocketOnline.deleteOne({ socket: socket.id })

      // Remove Auth User Channel
      !!socket.authID && socket.leave(socket.authID), socket.authID = null

      // Cập nhật online tới toàn máy chủ
      await sendOnline(io)
    }
    catch(e){
      return true
    }
  })
}