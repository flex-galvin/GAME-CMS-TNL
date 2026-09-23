import type { Types } from 'mongoose'

export interface IDBPaymentConfig {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  maintenance: boolean
  pay: {
    number: number
    expired: Date
  }
  min: number
  happyhour: {
    start: string
    end: string
    number: number
  }
}

export interface IDBPayment {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  gate: Types.ObjectId
  user: Types.ObjectId
  money: number
  code: string
  token: string
  card: {
    net: string
    seri: string
    pin: string
  }
  channel: {
    id: string
    name: string
    person: string
    number: string
    content: string
  }
  qrcode: string
  status: number,
  verify: {
    person: Types.ObjectId
    time: Date
    reason: string
  }
  auto: boolean

  save: () => void
}