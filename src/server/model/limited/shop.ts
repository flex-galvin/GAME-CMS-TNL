import type { Mongoose } from 'mongoose'
import type { IDBLimitedShop, IDBLimitedShopHistory } from '~~/types'

export const DBLimitedShop = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLimitedShop>({ 
    name: { type: String },
    key: { type: String },
    gift: [{
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
      amount: { type: Number, index: true },
    }],
    price: { type: Number, index: true },
    limit: { type: Number, default: 0, index: true },
    time: {
      start: { type: Date },
      end: { type: Date },
    },
    buyed: { type: Number, default: 0, index: true },
  }, {
    timestamps: true
  })

  schema.index({ name: 'text' })

  const model = mongoose.model('LimitedShop', schema, 'LimitedShop')
  return model 
}

export const DBLimitedShopHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLimitedShopHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    pack: { type: mongoose.Schema.Types.ObjectId, ref: 'LimitedShop', index: true },
    price: { type: Number, index: true },
    server: { type: String },
    role: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('LimitedShopHistory', schema, 'LimitedShopHistory')
  return model 
}