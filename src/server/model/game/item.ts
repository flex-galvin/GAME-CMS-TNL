import type { Mongoose } from 'mongoose'
import type { IDBItem, IDBItemBox } from '~~/types'

export const DBItem = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBItem>({ 
    item_id: { type: String },
    item_name: { type: String },
    item_image: { type: String },
    key: { type: String },
    type: { type: String },
  }, {
    timestamps: true
  })

  schema.index({ item_id: 'text', key: 'text' })
  const model = mongoose.model('Item', schema, 'Item')

  const autoCreate = async () => {
    const coin = await model.count({type: 'coin'})
    const wheel = await model.count({type: 'wheel'})
    const wheel_lose = await model.count({type: 'wheel_lose'})
    if(coin == 0){
      await model.create({ item_id: 'coin', type: 'coin', item_name: 'Xu Web' })
    }
    if(wheel == 0){
      await model.create({ item_id: 'wheel', type: 'wheel', item_name: 'Lượt chơi vòng quay' })
    }
    if(wheel_lose == 0){
      await model.create({ item_id: 'wheel_lose', type: 'wheel_lose', item_name: 'Mất lượt' })
    }
  }

  autoCreate()
  return model 
}

export const DBItemBox = (mongoose : Mongoose) => {
  const schema = new mongoose.Schema<IDBItemBox>({ 
    name: { type: String },
    key: { type: String },
    gift: [{
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', index: true },
      amount: { type: Number, index: true },
    }]
  }, {
    timestamps: true
  })

  schema.index({ name: 'text', key: 'text' })
  const model = mongoose.model('ItemBox', schema, 'ItemBox')

  return model 
}