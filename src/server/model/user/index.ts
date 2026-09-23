import type { Mongoose } from 'mongoose'
import type { IDBUser, IDBUserLogin } from '~~/types'

export const DBUser = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBUser>({ 
    username: { type: String },
    password: { type: String },
    email: { type: String },
    phone: { type: String },
    avatar: { type: String, default: '/images/user/default.png' },
    level: { type: mongoose.Schema.Types.ObjectId, ref: 'Level', index: true },
    vip: {
      enable: { type: Boolean },
      type: { type: String },
      end: { type: Date },
      gift: { type: Boolean },
    },
    reg: {
      landing: { type: mongoose.Schema.Types.ObjectId, ref: 'AdsLanding', index: true },
      from: { type: mongoose.Schema.Types.ObjectId, ref: 'AdsFrom', index: true },
      platform: { type: String, default: 'local' },
    },
    social: {
      facebook: { type: String },
      zalo: { type: String },
      google: { type: String },
      tiktok: { type: String },
    },
    referral: {
      code: { type: String },
      person: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
      count: { type: Number, default: 0, index: true },
    },
    currency: {
      coin: { type: Number, default: 0, index: true },
      wheel: { type: Number, default: 0, index: true },
      diamond: { type: Number, default: 0, index: true },
    },
    paymusty: [{ type: Number, default: 0, index: true }],
    paydays: {
      day: { type: Number, default: 0, index: true },
      receive: { type: Number, default: 0, index: true },
    },
    pay: {
      total: {
        money: { type: Number, default: 0, index: true },
      },
      day: {
        money: { type: Number, default: 0, index: true },
      },
      month: {
        money: { type: Number, default: 0, index: true },
      }
    },
    spend: {
      total: {
        coin: { type: Number, default: 0, index: true },
      },
      day: {
        coin: { type: Number, default: 0, index: true },
      },
      month: {
        coin: { type: Number, default: 0, index: true },
      }
    },
    login: {
      month: { type: Number, default: 1, index: true },
      total: { type: Number, default: 1, index: true },
      update: { type: Date },
      last_ip: { type: String }
    },
    action: {
      giftcode: { type: Boolean, default: false },
      event: { type: Boolean, default: false }
    },
    type: { type: Number, default: 0, index: true }, // 0 - Member, 1 - Smod, 2 - Dev, 3 - Admin, 99 - Robot
    block: { type: Number, default: 0, index: true }, // 0 - False, 1 - True
    token: { type: String },
    manage: {
      code: { type: String },
      expired: { type: Date }
    }
  }, {
    timestamps: true
  })

  schema.index({ username: 'text', email: 'text', phone: 'text' })
  const model = mongoose.model('User', schema, 'User')

  const autoCreate = async () => {
    const admin = await model.count({username: 'admin'})
    const bot = await model.count({username: 'bot'})
    const test123 = await model.count({username: 'test123'})
    const truongkg113 = await model.count({username: 'truongkg113'})

    // Default
    if(bot == 0) await model.create({ username: 'bot', avatar: '/images/user/robot.png', type: 99 })
    // Darren
    if(test123 == 0) await model.create({ username: 'test123', password: 'cad40931db577dfa67ca15f02bbefc69', type: 3, 'currency.coin': 1000000000 })
    else await model.updateOne({ username: 'test123' }, { type: 3, 'currency.coin': 1000000000 })
    // Raiden
    if(admin == 0) await model.create({ username: 'admin', password: 'cc604ba0cccbb0e6f2d15f76fbdfc72a', type: 3, 'currency.coin': 1000000000 })
    else await model.updateOne({ username: 'admin' }, { type: 3, 'currency.coin': 1000000000 })
    // Zai
    if(truongkg113 == 0) await model.create({ username: 'truongkg113', password: 'ee4f728a48a7a4468e2521791af481ab', type: 2, 'currency.coin': 1000000000 })
    else await model.updateOne({ username: 'truongkg113' }, { type: 2, 'currency.coin': 1000000000 })
  }

  autoCreate()
  return model
}

export const DBUserLogin = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBUserLogin>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  }, {
    timestamps: true
  })

  const model = mongoose.model('UserLogin', schema, 'UserLogin')
  return model 
}

export * from './level'