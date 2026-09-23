import type { Types } from 'mongoose'

export interface IDBLimitedShop {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  name: string
  key: string
  gift: Array<{
    item: Types.ObjectId | IDBItem,
    amount: number
  }>
  price: number
  limit: number
  time: {
    start: Date
    end: Date
  }
  buyed: number
}

export interface IDBLimitedShopHistory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId
  pack: Types.ObjectId
  price: number
  server: string
  role: string
}