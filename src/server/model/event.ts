import type { Mongoose } from 'mongoose'
import type { IDBEvent, IDBEventConfig, IDBEventHistory } from '~~/types'

export const DBEventConfig = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBEventConfig>({ 
    type: { type: String },
    name: { type: String },
    description: { type: String },
    start: { type: Date },
    end: { type: Date }
  }, {
    timestamps: true
  })

  const model = mongoose.model('EventConfig', schema, 'EventConfig')

  const autoCreate = async () => {
    const event1 = await model.count({ type: 'login.month' })
    if(!event1) await model.create({ type: 'login.month', name: 'Đăng nhập tháng' })

    const event2 = await model.count({ type: 'login.total' })
    if(!event2) await model.create({ type: 'login.total', name: 'Đăng nhập tổng' })

    const event3 = await model.count({ type: 'pay.total.money' })
    if(!event3) await model.create({ type: 'pay.total.money', name: 'Tích nạp tổng' })

    const event4 = await model.count({ type: 'pay.day.money' })
    if(!event4) await model.create({ type: 'pay.day.money', name: 'Tích nạp ngày' })

    const event5 = await model.count({ type: 'pay.month.money' })
    if(!event5) await model.create({ type: 'pay.month.money', name: 'Tích nạp tháng' })

    const event6 = await model.count({ type: 'spend.total.coin' })
    if(!event6) await model.create({ type: 'spend.total.coin', name: 'Tiêu phí tổng' })

    const event7 = await model.count({ type: 'spend.day.coin' })
    if(!event7) await model.create({ type: 'spend.day.coin', name: 'Tiêu phí ngày' })

    const event8 = await model.count({ type: 'spend.month.coin' })
    if(!event8) await model.create({ type: 'spend.month.coin', name: 'Tiêu phí tháng' })

    const event9 = await model.count({ type: 'referral.count' })
    if(!event9) await model.create({ type: 'referral.count', name: 'Giới thiệu bạn' })

    const event10 = await model.count({ type: 'paymusty' })
    if(!event10) await model.create({ type: 'paymusty', name: 'Nạp đơn' })

    const event11 = await model.count({ type: 'paydays' })
    if(!event11) await model.create({ type: 'paydays', name: 'Liên nạp' })
  }

  autoCreate()
  return model 
}

export const DBEvent = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBEvent>({ 
    type: { type: String, index: true },
    need: { type: Number, index: true },
    gift: [{
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
      amount: { type: Number, index: true },
    }],
    awardserver: [{
      servers: [{ type: String, index: true }],
      gift: [{
        item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
        amount: { type: Number, index: true },
      }],
    }],
    display: { type: Number, default: 1, index: true },
  }, {
    timestamps: true
  })

  const model = mongoose.model('Event', schema, 'Event')
  return model 
}

export const DBEventHistory = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBEventHistory>({ 
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
    event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', index: true },
    type: { type: String },
    server: { type: String },
    role: { type: String },
  }, {
    timestamps: true
  })

  const model = mongoose.model('EventHistory', schema, 'EventHistory')
  return model 
}

