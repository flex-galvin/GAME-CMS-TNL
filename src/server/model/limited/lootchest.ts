import type { Mongoose } from 'mongoose'
import type { IDBLimitedLootChest } from '~~/types'

export const DBLimitedLootChest = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLimitedLootChest>({ 
    time: {
      active: { type: Boolean, default: false },
      start: { type: Date },
      end: { type: Date },
    },

    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    
    receive: {
      status: { type: Boolean, default: false },
      role: { type: String },
      server: { type: String }
    },

    money: {
      min: { type: Number, default: 50000 },
      now: { type: Number, default: 0 },
      need: { type: Number, default: 50000 },
    },
  
    reward: [{
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
      amount: { type: Number, index: true },
    }]
  })

  const model = mongoose.model('LimitedLootChest', schema, 'LimitedLootChest')
  return model 
}