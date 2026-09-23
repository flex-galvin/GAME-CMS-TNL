import type { Types } from 'mongoose'
import type { IDBItem } from './game/item'

export interface IDBLimitedPay {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  time: {
    active: boolean
    start: Date | null
    end: Date | null
  }

  reward: Array<{
    step: number
    gift: Array<{
      item: Types.ObjectId | IDBItem
      amount: number
    }>
  }>

  // Function
  save: {
    () : void
  }
}

export interface IDBLimitedPayUser {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId
  money: number
}

export interface IDBLimitedPayHistory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId
  money: number
  server: string
  role: string
}