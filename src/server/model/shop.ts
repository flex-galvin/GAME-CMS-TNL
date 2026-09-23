import type { Mongoose } from 'mongoose'
import type { 
  IDBShopConfig,
  IDBShopPack, IDBShopPackHistory, 
  IDBShop, IDBShopHistory,
  IDBShopCategory
} from '~~/types'

export const DBShopConfig = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBShopConfig>({ 
    maintenance: { type: Boolean, default: false },
    discount: {
      number: { type: Number, default: 0 },
      expired: { type: Date }
    }
  }, {
    timestamps: true
  })

  const model = mongoose.model('ShopConfig', schema, 'ShopConfig')

  const autoCreate = async () => {
    const count = await model.count({})
    if(count == 0) return await model.create({})
  }
  autoCreate()
  
  return model 
}

export const DBShopCategory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBShopCategory>({ 
    name: { type: String },
    type: { type: String }
  }, {
    timestamps: true
  })

  const model = mongoose.model('ShopCategory', schema, 'ShopCategory')
  return model 
}

export const DBShop = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBShop>({ 
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopCategory', index: true },
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
    item_amount: { type: Number, default: 1, index: true },
    description: { type: String },
    price: { type: Number, index: true },
    servers: [{ type: String }],
    limit: { type: Number, default: 0, index: true },
    pin: { type: Number, default: 0, index: true },
    display: { type: Number, default: 1, index: true },
  }, {
    timestamps: true
  })

  const model = mongoose.model('Shop', schema, 'Shop')
  return model 
}

export const DBShopHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBShopHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
    amount: { type: Number, index: true },
    price: { type: Number, index: true },
    server: { type: String },
    role: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('ShopHistory', schema, 'ShopHistory')
  return model 
}

export const DBShopPack = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBShopPack>({ 
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopCategory', index: true },
    name: { type: String },
    description: { type: String },
    key: { type: String },
    servers: [{ type: String }],
    gift: [{
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
      amount: { type: Number, index: true },
    }],
    price: { type: Number, index: true },
    limit: { type: Number, default: 0, index: true },
    pin: { type: Number, default: 0, index: true },
    display: { type: Number, default: 1, index: true },
  }, {
    timestamps: true
  })

  schema.index({ name: 'text', key: 'text' })

  const model = mongoose.model('ShopPack', schema, 'ShopPack')
  return model 
}

export const DBShopPackHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBShopPackHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    pack: { type: mongoose.Schema.Types.ObjectId, ref: 'ShopPack', index: true },
    amount: { type: Number, default: 1, index: true },
    price: { type: Number, index: true },
    server: { type: String },
    role: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('ShopPackHistory', schema, 'ShopPackHistory')
  return model 
}