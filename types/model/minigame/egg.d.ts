import type { Types } from 'mongoose'

export interface IDBEgg {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  one: {
    price: number
    gift: Array<{
      item: Types.ObjectId | IDBItem,
      amount: number
      percent: number
    }>
  }

  two: {
    price: number
    gift: Array<{
      item: Types.ObjectId | IDBItem,
      amount: number
      percent: number
    }>
  }

  three: {
    price: number
    gift: Array<{
      item: Types.ObjectId | IDBItem,
      amount: number
      percent: number
    }>
  }

  four: {
    price: number
    gift: Array<{
      item: Types.ObjectId | IDBItem,
      amount: number
      percent: number
    }>
  }

  five: {
    price: number
    gift: Array<{
      item: Types.ObjectId | IDBItem,
      amount: number
      percent: number
    }>
  }

  six: {
    price: number
    gift: Array<{
      item: Types.ObjectId | IDBItem,
      amount: number
      percent: number
    }>
  }
}

export interface IDBEggUser {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId

  one: Array<{
    index: number
    history: Types.ObjectId
  }>
  two: Array<{
    index: number
    history: Types.ObjectId
  }>
  three: Array<{
    index: number
    history: Types.ObjectId
  }>
  four: Array<{
    index: number
    history: Types.ObjectId
  }>
  five: Array<{
    index: number
    history: Types.ObjectId
  }>
  six: Array<{
    index: number
    history: Types.ObjectId
  }>
}

export interface IDBEggHistory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId
  row: string
  index: number
  item: Types.ObjectId
  price: number
  amount: number
  percent: number
  server: string
  role: string
}