import type { Types } from 'mongoose'
import type { IDBUser } from '../user'
import type { IDBItem } from '../game'

export interface IDBLimitedLootChest {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  time: {
    active: boolean
    start: Date | null
    end: Date | null
  }

  owner: Types.ObjectId | IDBUser | null
  receive: {
    status: boolean
    role: string | null
    server: string | null
  }
  
  money: {
    min: number
    now: number
    need: number
  }

  reward: Array<{
    item: Types.ObjectId | IDBItem
    amount: number
  }>

  // Function
  save: {
    () : void
  }
}