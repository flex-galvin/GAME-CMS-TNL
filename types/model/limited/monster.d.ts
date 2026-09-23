import type { Types } from 'mongoose'
import type { IDBUser } from '../user'
import type { IDBItem } from '../game'

export interface IDBLimitedMonster {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  time: {
    active: boolean
    start: Date | null
    end: Date | null
  }
  blood: {
    min: number
    share: number
    payreward: number
    now: number
    target: number
    reward: Array<{
      step: number
      gift: Array<{
        item: Types.ObjectId | IDBItem,
        amount: number
      }>
      bonus: Array<{
        servers: Array<string>
        gift: Array<{
          item: Types.ObjectId | IDBItem,
          amount: number
        }>
      }>
    }>
  }
  top: {
    need: number
    max: number
    reward: Array<{
      rank: number
      gift: Array<{
        item: Types.ObjectId | IDBItem
        amount: number
      }>
      bonus: Array<{
        servers: Array<string>
        gift: Array<{
          item: Types.ObjectId | IDBItem,
          amount: number
        }>
      }>
    }>
  }
  lasthit: {
    user: Types.ObjectId | IDBUser | null
    receive: {
      status: boolean
      role: string | null
      server: string | null
    }
    reward: Array<{
      item: Types.ObjectId | IDBItem
      amount: number
    }>
    bonus: Array<{
      servers: Array<string>
      gift: Array<{
        item: Types.ObjectId | IDBItem,
        amount: number
      }>
    }>
  }

  // Function
  save: {
    () : void
  }
}

export interface IDBLimitedMonsterUser {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId
  point: number

  // Function
  save: {
    () : void
  }
}

export interface IDBLimitedMonsterBloodHistory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId
  server: string
  role: string
  step: number
}

export interface IDBLimitedMonsterTopHistory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId
  server: string
  role: string
  top: number
}