import type { Mongoose } from 'mongoose'
import type { IDBLimitedPay, IDBLimitedPayUser, IDBLimitedPayHistory } from '~~/types'

export const DBLimitedPay = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLimitedPay>({ 
    time: {
      active: { type: Boolean, default: false },
      start: { type: Date },
      end: { type: Date },
    },
    reward: [{
      step: { type: Number },
      gift: [{
        item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
        amount: { type: Number, index: true },
      }]
    }]
  })

  const model = mongoose.model('LimitedPay', schema, 'LimitedPay')
  return model 
}

export const DBLimitedPayUser = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLimitedPayUser>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    money: { type: Number, default: 0, index: true },
  }, {
    timestamps: true
  })

  const model = mongoose.model('LimitedPayUser', schema, 'LimitedPayUser')
  return model 
}

export const DBLimitedPayHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLimitedPayHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    server: { type: String },
    role: { type: String },
    money: { type: Number, index: true }
  }, {
    timestamps: true
  })

  const model = mongoose.model('LimitedPayHistory', schema, 'LimitedPayHistory')
  return model 
}
