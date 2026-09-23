import type { Mongoose } from 'mongoose'
import type { IDBGiftcode, IDBGiftcodeHistory } from '~~/types'

export const DBGiftcode = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGiftcode>({ 
    code: { type: String, index: true },
    limit: { type: Number, default: 0, index: true },
    needpay: { type: Number, default: 0, index: true },
    servers: [{ type: String }],
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true }],
    public: { type: Boolean, default: false },
    justone: { type: Boolean, default: false },
    gift: [{
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
      amount: { type: Number, index: true },
    }],
    expired: { type: Date },
    display: { type: Number, default: 1, index: true },
    hidegift: { type: Boolean, default: false },
  }, {
    timestamps: true
  })

  const model = mongoose.model('Giftcode', schema, 'Giftcode')
  return model 
}

export const DBGiftcodeHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGiftcodeHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    giftcode: { type: mongoose.Schema.Types.ObjectId, ref: 'Giftcode', index: true },
    server: { type: String },
    role: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('GiftcodeHistory', schema, 'GiftcodeHistory')
  return model 
}

