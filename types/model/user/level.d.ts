import type { Types } from 'mongoose'

export interface IDBLevel {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  
  number: number
  title: string
  need: {
    login: number
    pay: {
      money: number
    }
    spend: {
      coin: number
    }
  }
  bonus: number
  bonus_wheel: number
  bonus_presentee_pay: number
  discount: number
  gift_invited: Array<{
    item: Types.ObjectId | IDBItem,
    amount: number
  }>
}