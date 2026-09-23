import type { Types } from 'mongoose'
import type { IDBItem } from './game/item'

export interface IDBEventConfig {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  
  type: string
  name: string
  description: string
  start: Date
  end: Date
}

export interface IDBEvent {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  type: string
  gift: Array<{
    item: Types.ObjectId | IDBItem,
    amount: number
  }>
  awardserver: Array<{
    servers: Array<string>
    gift: Array<{
      item: Types.ObjectId | IDBItem,
      amount: number
    }>
  }>
  need: number
  display: number
}

export interface IDBEventHistory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  user: Types.ObjectId
  event: Types.ObjectId
  type: string
  server: string
  role: string
}