import type { Mongoose } from 'mongoose'
import type { IDBGameRankPowerUpProcess, IDBGameRankPowerUpProcessLog, IDBGameRankPowerUp, IDBGameRankProcess, IDBGameRankProcessLog, IDBGameMission, IDBGameMissionHistory } from '~~/types'
export * from './item'

export const DBGameRankPowerUpProcess = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGameRankPowerUpProcess>({ 
    servers: [{ type: String }],
    name: { type: String },
    start: { type: Date, index: true },
    end: { type: Date, index: true },
    active: { type: Boolean, default: false, index: true },
    send: { type: Boolean, default: false, index: true },
    processing: { type: Boolean, default: false, index: true },
    award: [{
      rank: { type: Number, index: true },
      gift: [{
        item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
        amount: { type: Number, index: true },
      }]
    }],
  }, {
    timestamps: true
  })

  const model = mongoose.model('GameRankPowerUpProcess', schema, 'GameRankPowerUpProcess')
  return model 
}

export const DBGameRankPowerUpProcessLog = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGameRankPowerUpProcessLog>({ 
    process: { type: mongoose.Schema.Types.ObjectId, ref: 'GameRankPowerUpProcess' },
    content: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('GameRankPowerUpProcessLog', schema, 'GameRankPowerUpProcessLog')
  return model 
}

export const DBGameRankPowerUp = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGameRankPowerUp>({ 
    process: { type: mongoose.Schema.Types.ObjectId, ref: 'GameRankPowerUpProcess' },
    server: { type: String, index: true },
    account: { type: String },
    role_name: { type: String },
    role_id: { type: String },
    power: { type: Number, index: true }
  }, {
    timestamps: true
  })

  schema.index({ createdAt: 1 })
  const model = mongoose.model('GameRankPowerUp', schema, 'GameRankPowerUp')
  return model 
}

export const DBGameRankProcess = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGameRankProcess>({ 
    server: { type: String, index: true },
    type: { type: String },
    end: { type: Date, index: true },
    active: { type: Boolean, default: false, index: true },
    send: { type: Boolean, default: false, index: true },
    processing: { type: Boolean, default: false, index: true },
    award: [{
      rank: { type: Number, index: true },
      gift: [{
        item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
        amount: { type: Number, index: true },
      }]
    }],
  }, {
    timestamps: true
  })

  const model = mongoose.model('GameRankProcess', schema, 'GameRankProcess')
  return model 
}

export const DBGameRankProcessLog = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGameRankProcessLog>({ 
    process: { type: mongoose.Schema.Types.ObjectId, ref: 'GameRankProcess' },
    content: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('GameRankProcessLog', schema, 'GameRankProcessLog')
  return model 
}

export const DBGameMission = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGameMission>({ 
    server: { type: String, index: true },
    type: { type: String },
    need: { type: Number, index: true },
    gift: [{
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
      amount: { type: Number, index: true },
    }]
  }, {
    timestamps: true
  })

  const model = mongoose.model('GameMission', schema, 'GameMission')
  return model 
}

export const DBGameMissionHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGameMissionHistory>({ 
    mission: { type: mongoose.Schema.Types.ObjectId, ref: 'GameMission', index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    server: { type: String },
    role: { type: String }
  }, {
    timestamps: true
  })

  const model = mongoose.model('GameMissionHistory', schema, 'GameMissionHistory')
  return model 
}
