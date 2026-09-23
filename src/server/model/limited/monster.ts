import type { Mongoose } from 'mongoose'
import type { IDBLimitedMonster, IDBLimitedMonsterUser, IDBLimitedMonsterBloodHistory, IDBLimitedMonsterTopHistory } from '~~/types'

export const DBLimitedMonster = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLimitedMonster>({ 
    time: {
      active: { type: Boolean, default: false },
      start: { type: Date },
      end: { type: Date },
    },
    blood: {
      min: { type: Number, default: 50000 },
      share: { type: Number, default: 100 },
      payreward: { type: Number, default: 500000 },
      now: { type: Number, default: 0 },
      target: { type: Number, default: 100000000 },
      reward: [{
        step: { type: Number },
        gift: [{
          item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
          amount: { type: Number, index: true },
        }],
        bonus: [{
          servers: [{ type: String, index: true }],
          gift: [{
            item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
            amount: { type: Number, index: true },
          }],
        }]
      }],

    },
    top: {
      need: { type: Number, default: 1000000 },
      max: { type: Number, default: 10 },
      reward: [{
        rank: { type: Number },
        gift: [{
          item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
          amount: { type: Number, index: true },
        }],
        bonus: [{
          servers: [{ type: String, index: true }],
          gift: [{
            item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
            amount: { type: Number, index: true },
          }],
        }]
      }]
    },
    lasthit: {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
      receive: {
        status: { type: Boolean, default: false },
        role: { type: String },
        server: { type: String }
      },
      reward: [{
        item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
        amount: { type: Number, index: true },
      }],
      bonus: [{
        servers: [{ type: String, index: true }],
        gift: [{
          item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
          amount: { type: Number, index: true },
        }],
      }]
    }
  })

  const model = mongoose.model('LimitedMonster', schema, 'LimitedMonster')
  return model 
}

export const DBLimitedMonsterUser = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLimitedMonsterUser>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    point: { type: Number, default: 0, index: true },
  }, {
    timestamps: true
  })

  const model = mongoose.model('LimitedMonsterUser', schema, 'LimitedMonsterUser')
  return model 
}

export const DBLimitedMonsterBloodHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLimitedMonsterBloodHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    server: { type: String },
    role: { type: String },
    step: { type: Number }
  }, {
    timestamps: true
  })

  const model = mongoose.model('LimitedMonsterBloodHistory', schema, 'LimitedMonsterBloodHistory')
  return model 
}

export const DBLimitedMonsterTopHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLimitedMonsterTopHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    server: { type: String },
    role: { type: String },
    top: { type: Number }
  }, {
    timestamps: true
  })

  const model = mongoose.model('LimitedMonsterTopHistory', schema, 'LimitedMonsterTopHistory')
  return model 
}