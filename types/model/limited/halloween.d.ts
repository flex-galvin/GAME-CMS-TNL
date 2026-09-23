import type { Types } from 'mongoose'

export interface IDBLimitedHalloween {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  time: {
    active: boolean
    start: Date | null
    end: Date | null
  }
  jar: {
    min: number
    share: number
    payreward: number
    now: number
    target: number
    reward: Array<{
      item: Types.ObjectId | IDBItem,
      amount: number
    }>
  }
  top: {
    need: number
    max: number
    reward: Array<{
      rank: number
      gift: Array<{
        item: Types.ObjectId | IDBItem,
        amount: number
      }>
    }>
  }
  pumpkin: {
    share: number
    candy: number
    reward: Array<{
      item: Types.ObjectId | IDBItem,
      amount: number
    }>
  }

  // Function
  save: {
    () : void
  }
}

export interface IDBLimitedHalloweenUser {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId
  point: number
  candy: number
  pumpkin: {
    play: boolean
    reward: Array<{
      item: Types.ObjectId | IDBItem,
      amount: number
    }>
    result: Types.ObjectId | IDBItem
  }
  top: number

  // Function
  save: {
    () : void
  }
}

export interface IDBLimitedHalloweenJarHistory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId
  server: string
  role: string
}

export interface IDBLimitedHalloweenTopHistory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId
  server: string
  role: string
  top: number
}

export interface IDBLimitedHalloweenPumpkinHistory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId
  result: Types.ObjectId
  server: string
  role: string
  item: Types.ObjectId
  amount: number
  win: boolean
}
