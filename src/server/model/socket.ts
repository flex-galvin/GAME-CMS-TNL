import type { Mongoose } from 'mongoose'
import type { IDBSocketChat, IDBSocketOnline } from '~~/types'

export const DBSocketOnline = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBSocketOnline>({ 
    socket: { type: 'String' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }
  }, {
    timestamps: true
  })

  const model = mongoose.model('SocketOnline', schema, 'SocketOnline')

  const autoCreate = async () => {
    await model.deleteMany()
  }
  autoCreate()

  return model 
}

export const DBSocketChat = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBSocketChat>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    text: { type: String },
    type: { type: String, default: 'message' }
  }, {
    timestamps: true
  })

  const model = mongoose.model('SocketChat', schema, 'SocketChat')
  return model 
}