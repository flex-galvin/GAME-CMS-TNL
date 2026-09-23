import type { Mongoose } from 'mongoose'
import type { IDBLimitedHalloween, IDBLimitedHalloweenUser, IDBLimitedHalloweenJarHistory, IDBLimitedHalloweenPumpkinHistory, IDBLimitedHalloweenTopHistory } from '~~/types'

export const DBLimitedHalloween = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLimitedHalloween>({ 
    time: {
      active: { type: Boolean, default: false },
      start: { type: Date },
      end: { type: Date },
    },
    jar: {
      min: { type: Number, default: 50000 },
      share: { type: Number, default: 100 },
      payreward: { type: Number, default: 500000 },
      now: { type: Number, default: 0 },
      target: { type: Number, default: 100000000 },
      reward: [{
        item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
        amount: { type: Number, index: true },
      }]
    },
    top: {
      need: { type: Number, default: 1000000 },
      max: { type: Number, default: 10 },
      reward: [{
        rank: { type: Number },
        gift: [{
          item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
          amount: { type: Number, index: true },
        }]
      }]
    },
    pumpkin: {
      share: { type: Number, default: 20000 },
      candy: { type: Number, default: 1 },
      reward: [{
        item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
        amount: { type: Number, index: true },
      }],
    }
  })

  const model = mongoose.model('LimitedHalloween', schema, 'LimitedHalloween')
  return model 
}

export const DBLimitedHalloweenUser = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLimitedHalloweenUser>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    point: { type: Number, default: 0, index: true },
    candy: { type: Number, default: 0, index: true },
    pumpkin: {
      play: { type: Boolean, default: false },
      reward: [{
        item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
        amount: { type: Number, index: true },
      }],
      result: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true }
    },
    top: { type: Number, default: 0 },
  }, {
    timestamps: true
  })

  const model = mongoose.model('LimitedHalloweenUser', schema, 'LimitedHalloweenUser')
  return model 
}

export const DBLimitedHalloweenJarHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLimitedHalloweenJarHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    server: { type: String },
    role: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('LimitedHalloweenJarHistory', schema, 'LimitedHalloweenJarHistory')
  return model 
}

export const DBLimitedHalloweenTopHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLimitedHalloweenTopHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    server: { type: String },
    role: { type: String },
    top: { type: Number, index: true }
  }, {
    timestamps: true
  })

  const model = mongoose.model('LimitedHalloweenTopHistory', schema, 'LimitedHalloweenTopHistory')
  return model 
}

export const DBLimitedHalloweenPumpkinHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLimitedHalloweenPumpkinHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    result: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
    server: { type: String },
    role: { type: String },
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
    amount: { type: Number, index: true },
    win: { type: Boolean }
  }, {
    timestamps: true
  })

  const model = mongoose.model('LimitedHalloweenPumpkinHistory', schema, 'LimitedHalloweenPumpkinHistory')
  return model 
}