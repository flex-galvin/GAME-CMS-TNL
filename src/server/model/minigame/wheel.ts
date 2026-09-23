import type { Mongoose } from 'mongoose'
import type { IDBWheel, IDBWheelHistory } from '~~/types'

export const DBWheel = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBWheel>({ 
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
    amount: { type: Number, index: true },
    percent: { type: Number, index: true },
    display: { type: Number, default: 1, index: true },
  }, {
    timestamps: true
  })

  const model = mongoose.model('Wheel', schema, 'Wheel')
  return model 
}

export const DBWheelHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBWheelHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
    amount: { type: Number, index: true },
    percent: { type: Number, index: true },
    server: { type: String },
    role: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('WheelHistory', schema, 'WheelHistory')
  return model 
}