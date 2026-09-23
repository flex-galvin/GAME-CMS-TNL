import type { Types } from 'mongoose'
import type { IDBLevel } from '../level'

export * from './level'

export interface IDBUser {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  username: string
  password: string
  email: string
  phone: string
  avatar: string
  level: Types.ObjectId | IDBLevel
  vip: {
    enable: boolean
    type: string
    end: Date | null
    gift: boolean
  },
  reg: {
    landing: Types.ObjectId
    from: Types.ObjectId
    platform: string
  }
  social: {
    facebook: string
    zalo: string
    google: string
    tiktok: string
  }
  referral: {
    code: string
    person: Types.ObjectId
    count: number
  }
  currency: {
    coin: number
    wheel: number
    diamond: number
  }
  paymusty: Array<number>
  paydays: {
    day: number
    receive: number
  }
  pay: {
    total: {
      money: number
    },
    day: {
      money: number
    },
    month: {
      money: number
    }
  }
  spend: {
    total: {
      coin: number
    },
    day: {
      coin: number
    },
    month: {
      coin: number
    }
  }
  login: {
    month: number
    total: number
    update: Date
    last_ip: string
  }
  action: {
    giftcode: boolean
    event: boolean
  }
  type: number
  block: number
  token: string
  manage: {
    code: string
    expired: Date
  }
  // Function
  save: {
    () : void
  }
}

export interface IDBUserLogin {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date
  user: Types.ObjectId
}

export interface IDBUserStore {
  _id? : Types.ObjectId
  username? : IDBUser['username']
  level? : IDBLevel
  vip?: IDBUser['vip']
  type?: IDBUser['type']
  referral_code?: IDBUser['referral']['code']
  currency?: IDBUser['currency']
}