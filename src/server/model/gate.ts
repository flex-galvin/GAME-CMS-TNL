import type { Mongoose } from 'mongoose'
import type { IDBGate } from '~~/types'

export const DBGate = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBGate>({ 
    type: { type: Number, index: true }, // 1-Card, 2-Bank, 3-Momo
    name: { type: String },
    person: { type: String },
    number: { type: String },
    key: { type: String },
    qrcode: { type: String },
    bonus: {
      default: { type: Number, default: 0, index: true },
      limit: {
        number: { type: Number, default: 0, index: true },
        expired: { type: Date },
      }
    },
    display: { type: Number, default: 1, index: true },
    dynamic: {
      enable: { type: Boolean, default: false },
      api: { type: String, default: '' },
      sign: { type: String, default: '' },
      key: { type: String, default: '' },
      check: { type: String, default: '' },
    }
  }, {
    timestamps: true
  })

  const model = mongoose.model('Gate', schema, 'Gate')
  return model 
}

