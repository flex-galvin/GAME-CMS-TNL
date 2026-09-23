import type { Mongoose } from 'mongoose'
import type { IDBAdsLanding, IDBAdsFrom } from '~~/types'

export const DBAdsFrom = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBAdsFrom>({ 
    code: { type: String },
    note: { type: String },
    view: { type: Number, default: 0, index: true },
    sign: {
      in: { type: Number, default: 0, index: true },
      up: { type: Number, default: 0, index: true },
    }
  }, {
    timestamps: true
  })

  const model = mongoose.model('AdsFrom', schema, 'AdsFrom')
  return model 
}

export const DBAdsLanding = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBAdsLanding>({ 
    code: { type: String },
    link: { type: String },
    view: { type: Number, default: 0, index: true },
    sign: {
      in: { type: Number, default: 0, index: true },
      up: { type: Number, default: 0, index: true },
    },
    onup: { type: Boolean, default: false }
  }, {
    timestamps: true
  })

  const model = mongoose.model('AdsLanding', schema, 'AdsLanding')
  return model 
}