import type { Mongoose } from 'mongoose'
import type { IDBLevel } from '~~/types'

export const DBLevel = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBLevel>({ 
    number: { type: Number, index: true },
    title: { type: String },
    need: {
      login: { type: String, default: 0, index: true },
      pay: {
        money: { type: Number, default: 0, index: true },
      },
      spend: {
        coin: { type: Number, default: 0, index: true },
      }
    },
    bonus: { type: Number, default: 0, index: true },
    bonus_wheel: { type: Number, default: 0, index: true },
    bonus_presentee_pay: { type: Number, default: 0, index: true },
    discount: { type: Number, default: 0, index: true },
    gift_invited: [{
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
      amount: { type: Number, index: true },
    }]
  }, {
    timestamps: true
  })

  const model = mongoose.model('Level', schema, 'Level')

  const autoCreate = async () => {
    const count = await model.count({})
    if(count == 0) {
      await model.create({ title: 'Luyện Khí', number: 1, 'need.pay.money': 0 })
      await model.create({ title: 'Trúc Cơ', number: 2, 'need.pay.money': 1000000 })
      await model.create({ title: 'Kim Đan', number: 3, 'need.pay.money': 2000000 })
      await model.create({ title: 'Nguyên Anh', number: 4, 'need.pay.money': 5000000 })
      await model.create({ title: 'Hóa Thần', number: 5, 'need.pay.money': 10000000 })
      await model.create({ title: 'Luyện Hư', number: 6, 'need.pay.money': 20000000 })
      await model.create({ title: 'Hợp Thể', number: 7, 'need.pay.money': 50000000 })
      await model.create({ title: 'Đại Thừa', number: 8, 'need.pay.money': 100000000 })
      await model.create({ title: 'Độ Kiếp', number: 9, 'need.pay.money': 200000000 })
      await model.create({ title: 'Chân Tiên', number: 10, 'need.pay.money': 500000000 })
      await model.create({ title: 'Thượng Tiên', number: 11, 'need.pay.money': 1000000000 })
      await model.create({ title: 'Thiên Tiên', number: 12, 'need.pay.money': 2000000000 })
      await model.create({ title: 'Tiên Vương', number: 13, 'need.pay.money': 3000000000 })
      await model.create({ title: 'Tiên Quân', number: 14, 'need.pay.money': 4000000000 })
      await model.create({ title: 'Tiên Đế', number: 15, 'need.pay.money': 5000000000 })
    }
    if(count == 1) {
      await model.updateOne({ number: 1 }, { title: 'Luyện Khí' })
      await model.create({ title: 'Trúc Cơ', number: 2, 'need.pay.money': 1000000 })
      await model.create({ title: 'Kim Đan', number: 3, 'need.pay.money': 2000000 })
      await model.create({ title: 'Nguyên Anh', number: 4, 'need.pay.money': 5000000 })
      await model.create({ title: 'Hóa Thần', number: 5, 'need.pay.money': 10000000 })
      await model.create({ title: 'Luyện Hư', number: 6, 'need.pay.money': 20000000 })
      await model.create({ title: 'Hợp Thể', number: 7, 'need.pay.money': 50000000 })
      await model.create({ title: 'Đại Thừa', number: 8, 'need.pay.money': 100000000 })
      await model.create({ title: 'Độ Kiếp', number: 9, 'need.pay.money': 200000000 })
      await model.create({ title: 'Chân Tiên', number: 10, 'need.pay.money': 500000000 })
      await model.create({ title: 'Thượng Tiên', number: 11, 'need.pay.money': 1000000000 })
      await model.create({ title: 'Thiên Tiên', number: 12, 'need.pay.money': 2000000000 })
      await model.create({ title: 'Tiên Vương', number: 13, 'need.pay.money': 3000000000 })
      await model.create({ title: 'Tiên Quân', number: 14, 'need.pay.money': 4000000000 })
      await model.create({ title: 'Tiên Đế', number: 15, 'need.pay.money': 5000000000 })
    }
  }

  autoCreate()
  return model 
}

