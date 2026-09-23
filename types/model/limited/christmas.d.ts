import type { Types } from 'mongoose'

export interface IDBLimitedChristmas {
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
    now: number
    target: number
    payreward: number
    reward: Array<{
      step: number
      gift: Array<{
        item: Types.ObjectId | IDBItem,
        amount: number
      }>
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
  box: {
    share: number
    sticker: number
    random: Array<{
      item: Types.ObjectId | IDBItem,
      amount: number
      percent: number
    }>
    reward: Array<{
      step: number
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

export interface IDBLimitedChristmasUser {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId
  point: number
  star: number
  box: number
  sticker: number
  top: number

  // Function
  save: {
    () : void
  }
}

export interface IDBLimitedChristmasJarHistory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId
  server: string
  role: string
  step: number
}

export interface IDBLimitedChristmasTopHistory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId
  server: string
  role: string
  top: number
}

export interface IDBLimitedChristmasBoxHistory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId
  server: string
  role: string
  item: Types.ObjectId
  amount: number
  percent: number
}

export interface IDBLimitedChristmasBoxStepHistory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId
  server: string
  role: string
  step: number
}
