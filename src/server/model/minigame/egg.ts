import type { Mongoose } from 'mongoose'
import type { IDBEgg, IDBEggUser, IDBEggHistory } from '~~/types'

export const DBEgg = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBEgg>({ 
    one: {
      price: { type: Number, index: true, default: 100000 },
      gift: [{
        item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
        amount: { type: Number, index: true },
        percent: { type: Number, index: true },
      }]
    },

    two: {
      price: { type: Number, index: true, default: 50000 },
      gift: [{
        item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
        amount: { type: Number, index: true },
        percent: { type: Number, index: true },
      }]
    },

    three: {
      price: { type: Number, index: true, default: 40000 },
      gift: [{
        item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
        amount: { type: Number, index: true },
        percent: { type: Number, index: true },
      }]
    },

    four: {
      price: { type: Number, index: true, default: 30000 },
      gift: [{
        item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
        amount: { type: Number, index: true },
        percent: { type: Number, index: true },
      }]
    },

    five: {
      price: { type: Number, index: true, default: 20000 },
      gift: [{
        item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
        amount: { type: Number, index: true },
        percent: { type: Number, index: true },
      }]
    },

    six: {
      price: { type: Number, index: true, default: 10000 },
      gift: [{
        item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
        amount: { type: Number, index: true },
        percent: { type: Number, index: true },
      }]
    }
  }, {
    timestamps: true
  })

  const model = mongoose.model('Egg', schema, 'Egg')

  const autoCreate = async () => {
    const count = await model.count({})
    if(count == 0) return await model.create({})
  }

  autoCreate()
  return model 
}

export const DBEggUser = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBEggUser>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },

    one: [{
      index: { type: Number },
      history: { type: mongoose.Schema.Types.ObjectId, ref: 'EggHistory', index: true }
    }],
    two: [{
      index: { type: Number },
      history: { type: mongoose.Schema.Types.ObjectId, ref: 'EggHistory', index: true }
    }],
    three: [{
      index: { type: Number },
      history: { type: mongoose.Schema.Types.ObjectId, ref: 'EggHistory', index: true }
    }],
    four: [{
      index: { type: Number },
      history: { type: mongoose.Schema.Types.ObjectId, ref: 'EggHistory', index: true }
    }],
    five: [{
      index: { type: Number },
      history: { type: mongoose.Schema.Types.ObjectId, ref: 'EggHistory', index: true }
    }],
    six: [{
      index: { type: Number },
      history: { type: mongoose.Schema.Types.ObjectId, ref: 'EggHistory', index: true }
    }]
  }, {
    timestamps: true
  })

  const model = mongoose.model('EggUser', schema, 'EggUser')
  return model 
}

export const DBEggHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBEggHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    row: { type: String },
    index: { type: Number },
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
    price: { type: Number, index: true, default: 0 },
    amount: { type: Number, index: true },
    percent: { type: Number, index: true },
    server: { type: String },
    role: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('EggHistory', schema, 'EggHistory')
  return model 
}
