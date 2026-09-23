import type { Mongoose } from 'mongoose'
import type { IDBPayment, IDBPaymentConfig } from '~~/types'

export const DBPaymentConfig = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBPaymentConfig>({ 
    maintenance: { type: Boolean, default: false },
    pay: {
      number: { type: Number, default: 0 },
      expired: { type: Date }
    },
    min: { type: Number, default: 20000 },
    happyhour: {
      start: { type: String }, 
      end: { type: String }, 
      number: { type: Number, default: 0 },
    }
  }, {
    timestamps: true
  })

  const model = mongoose.model('PaymentConfig', schema, 'PaymentConfig')

  const autoCreate = async () => {
    const count = await model.count({})
    if(count == 0) return await model.create({})
  }
  autoCreate()
  
  return model 
}

export const DBPayment = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBPayment>({ 
    gate: { type: mongoose.Schema.Types.ObjectId, ref: 'Gate', index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    money: { type: Number, index: true },
    code: { type: String }, 
    token: { type: String },
    card: {
      net: { type: String }, 
      seri: { type: String }, 
      pin: { type: String },
    },
    channel: {
      id: { type: String },
      name: { type: String },
      person: { type: String },
      number: { type: String },
      content: { type: String },
    },
    qrcode: { type: String },
    status: { type: Number, default: 0 , index: true }, // 0-Wait 1-Success 2-Refuse,
    verify: {
      person: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
      time: { type: Date, index: true },
      reason: { type: String },
    },
    auto: { type: Boolean },
  }, {
    timestamps: true
  })

  schema.index({ code: 'text' })

  const model = mongoose.model('Payment', schema, 'Payment')
  return model 
}
