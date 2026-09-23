import type { Mongoose } from 'mongoose'
import type { 
  IDBLimitedLunar, 
  IDBLimitedLunarUser, 
  IDBLimitedLunarJarHistory, 
  IDBLimitedLunarRedbagHistory, IDBLimitedLunarRedbagStepHistory,
  IDBLimitedLunarTopHistory, 
  IDBLimitedLunarPieceHistory, 
  IDBLimitedLunarPieceRewardHistory 
} from '~~/types'

export const DBLimitedLunar = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLimitedLunar>({ 
    time: {
      active: { type: Boolean, default: false },
      start: { type: Date },
      end: { type: Date },
    },
    eve: {
      time: { type: Date },
      gift: [{
        item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
        amount: { type: Number, index: true },
      }]
    },
    bonus: {
      start: { type: Date },
      end: { type: Date },
      value: { type: Number, default: 2 },
      enable: {
        jar: { type: Boolean, default: false },
        eve: { type: Boolean, default: false },
        top: { type: Boolean, default: false },
        redbag: { type: Boolean, default: true },
        piece: { type: Boolean, default: false },
      }
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
    redbag: {
      day: { type: Number, default: 1 },
      share: { type: Number, default: 20000 },
      piece: { type: Number, default: 1 },
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
    },
    piece: {
      percent: {
        A: { type: Number, default: 10 },
        B: { type: Number, default: 20 },
        C: { type: Number, default: 30 },
        D: { type: Number, default: 0 },
      },
      reward: [{
        pieces: [{ type: String }],
        gift: [{
          item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
          amount: { type: Number, index: true },
        }]
      }]
    }
  })

  const model = mongoose.model('LimitedLunar', schema, 'LimitedLunar')
  return model 
}

export const DBLimitedLunarUser = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLimitedLunarUser>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    point: { type: Number, default: 0, index: true },
    redbag: {
      count: { type: Number, default: 0, index: true },
      use: { type: Number, default: 0, index: true },
    },
    piece: { // Số mảnh ghép
      A: { type: Number, default: 0, index: true },
      B: { type: Number, default: 0, index: true },
      C: { type: Number, default: 0, index: true },
      D: { type: Number, default: 0, index: true },
    },
    eve: { type: Boolean },
    top: { type: Number, default: 0 },
  }, {
    timestamps: true
  })

  const model = mongoose.model('LimitedLunarUser', schema, 'LimitedLunarUser')
  return model 
}

export const DBLimitedLunarJarHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLimitedLunarJarHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    server: { type: String },
    role: { type: String },
    step: { type: Number }
  }, {
    timestamps: true
  })

  const model = mongoose.model('LimitedLunarJarHistory', schema, 'LimitedLunarJarHistory')
  return model 
}

export const DBLimitedLunarTopHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLimitedLunarTopHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    server: { type: String },
    role: { type: String },
    top: { type: Number }
  }, {
    timestamps: true
  })

  const model = mongoose.model('LimitedLunarTopHistory', schema, 'LimitedLunarTopHistory')
  return model 
}

export const DBLimitedLunarRedbagHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLimitedLunarRedbagHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    server: { type: String },
    role: { type: String },
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
    amount: { type: Number, index: true },
    percent: { type: Number, index: true}
  }, {
    timestamps: true
  })

  const model = mongoose.model('LimitedLunarRedbagHistory', schema, 'LimitedLunarRedbagHistory')
  return model 
}

export const DBLimitedLunarRedbagStepHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLimitedLunarRedbagStepHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    server: { type: String },
    role: { type: String },
    step: { type: Number, index: true },
  }, {
    timestamps: true
  })

  const model = mongoose.model('LimitedLunarRedbagStepHistory', schema, 'LimitedLunarRedbagStepHistory')
  return model 
}

export const DBLimitedLunarPieceHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLimitedLunarPieceHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    piece: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('LimitedLunarPieceHistory', schema, 'LimitedLunarPieceHistory')
  return model 
}

export const DBLimitedLunarPieceRewardHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLimitedLunarPieceRewardHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    server: { type: String },
    role: { type: String },
    pieces: [{ type: String }]
  }, {
    timestamps: true
  })

  const model = mongoose.model('LimitedLunarPieceRewardHistory', schema, 'LimitedLunarPieceRewardHistory')
  return model 
}