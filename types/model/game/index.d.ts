import type { Types } from 'mongoose'
export * from './item'

export interface IDBGameRankPowerUpProcess {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  servers: Array<string>
  name: string
  start: date
  end: date
  active: boolean
  send: boolean
  processing: boolean
  award: Array<{
    rank: number
    gift: Array<{
      item: Types.ObjectId | IDBItem,
      amount: number
    }>
  }>
}

export interface IDBGameRankPowerUpProcessLog {
  process: Types.ObjectId
  content: string
}

export interface IDBGameRankPowerUp {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  process: Types.ObjectId
  server: string
  account: string
  role_name: string
  role_id: string
  power: number
}

export interface IDBGameRankProcess {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  server: string
  type: string
  end: date
  active: boolean
  send: boolean
  processing: boolean
  award: Array<{
    rank: number
    gift: Array<{
      item: Types.ObjectId | IDBItem,
      amount: number
    }>
  }>
}

export interface IDBGameRankProcessLog {
  process: Types.ObjectId
  content: string
}

export interface IDBGameMission {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  server: string
  type: string
  need: date
  gift: Array<{
    item: Types.ObjectId | IDBItem,
    amount: number
  }>
}

export interface IDBGameMissionHistory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  mission: Types.ObjectId
  user: Types.ObjectId
  server: string
  role: string
}