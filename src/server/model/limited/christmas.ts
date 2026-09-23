import type { Mongoose } from 'mongoose'
import type { IDBLimitedChristmas, IDBLimitedChristmasUser, IDBLimitedChristmasJarHistory, IDBLimitedChristmasBoxHistory, IDBLimitedChristmasTopHistory, IDBLimitedChristmasBoxStepHistory } from '~~/types'

export const DBLimitedChristmas = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLimitedChristmas>({ 
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
        step: { type: Number },
        gift: [{
          item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
          amount: { type: Number, index: true },
        }]
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
    box: {
      share: { type: Number, default: 20000 },
      sticker: { type: Number, default: 1 },
      random: [{
        item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
        amount: { type: Number, index: true },
        percent: { type: Number, index: true },
      }],
      reward: [{
        step: { type: Number },
        gift: [{
          item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
          amount: { type: Number, index: true },
        }]
      }]
    }
  })

  const model = mongoose.model('LimitedChristmas', schema, 'LimitedChristmas')
  return model 
}

export const DBLimitedChristmasUser = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLimitedChristmasUser>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    point: { type: Number, default: 0, index: true },
    star: { type: Number, default: 0, index: true },
    box: { type: Number, default: 0, index: true },
    sticker: { type: Number, default: 0, index: true },
    top: { type: Number, default: 0 },
  }, {
    timestamps: true
  })

  const model = mongoose.model('LimitedChristmasUser', schema, 'LimitedChristmasUser')
  return model 
}

export const DBLimitedChristmasJarHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLimitedChristmasJarHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    server: { type: String },
    role: { type: String },
    step: { type: Number }
  }, {
    timestamps: true
  })

  const model = mongoose.model('LimitedChristmasJarHistory', schema, 'LimitedChristmasJarHistory')
  return model 
}

export const DBLimitedChristmasTopHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLimitedChristmasTopHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    server: { type: String },
    role: { type: String },
    top: { type: Number }
  }, {
    timestamps: true
  })

  const model = mongoose.model('LimitedChristmasTopHistory', schema, 'LimitedChristmasTopHistory')
  return model 
}

export const DBLimitedChristmasBoxHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLimitedChristmasBoxHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    server: { type: String },
    role: { type: String },
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
    amount: { type: Number, index: true },
    percent: { type: Number, index: true}
  }, {
    timestamps: true
  })

  const model = mongoose.model('LimitedChristmasBoxHistory', schema, 'LimitedChristmasBoxHistory')
  return model 
}

export const DBLimitedChristmasBoxStepHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLimitedChristmasBoxStepHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    server: { type: String },
    role: { type: String },
    step: { type: Number, index: true },
  }, {
    timestamps: true
  })

  const model = mongoose.model('LimitedChristmasBoxStepHistory', schema, 'LimitedChristmasBoxStepHistory')
  return model 
}