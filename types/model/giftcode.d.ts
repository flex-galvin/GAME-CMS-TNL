import type { Types } from 'mongoose'
import type { IDBItem } from './game/item'

export interface IDBGiftcode {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  code: string
  limit: number
  needpay: number
  servers: Array<string>
  users: Array<Types.ObjectId>
  public: boolean
  justone: boolean
  gift: Array<{
    item: Types.ObjectId | IDBItem,
    amount: number
  }>
  expired: Date
  display: number
  hidegift: boolean
}

export interface IDBGiftcodeHistory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  user: Types.ObjectId
  giftcode: Types.ObjectId
  server: string
  role: string
}