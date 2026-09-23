import type { Types } from 'mongoose'

export interface IDBLimitedLunar {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  time: {
    active: boolean
    start: Date | null
    end: Date | null
  }
  eve: {
    time: Date | null
    gift: Array<{
      item: Types.ObjectId | IDBItem,
      amount: number
    }>
  }
  bonus: {
    start: Date | null
    end: Date | null
    value: number
    enable: {
      jar: boolean
      eve: boolean
      top: boolean
      redbag: boolean
      piece: boolean
    }
  }
  jar: {
    min: number // Giá trị nạp tối thiểu
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
    need: number // Số điểm tối thiểu lên TOP
    max: number // Số xếp hạng tối đa
    reward: Array<{
      rank: number
      gift: Array<{
        item: Types.ObjectId | IDBItem,
        amount: number
      }>
    }>
  }
  redbag: {
    day: number // Mỗi ngày truy cập, tặng miễn phí bao nhiêu lì xì
    share: number // Mỗi bao nhiêu tiền nhận 1 lì xì
    piece: number // Tỷ lệ ra mảnh ghép
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
  piece: { 
    percent: { // Tỷ lệ ra mảnh ghép
      A: number
      B: number
      C: number
      D: number
    }
    reward: Array<{
      pieces: Array<string>
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

export interface IDBLimitedLunarUser {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId
  point: number // Số tiền nạp
  redbag: {
    count: number // Số lì xì
    use: number // Đã mở
  }
  piece: { // Số mảnh ghép
    A: number
    B: number
    C: number
    D: number
  }
  eve: boolean
  top: number

  // Function
  save: {
    () : void
  }
}

export interface IDBLimitedLunarJarHistory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId
  server: string
  role: string
  step: number
}

export interface IDBLimitedLunarTopHistory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId
  server: string
  role: string
  top: number
}

export interface IDBLimitedLunarRedbagHistory {
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

export interface IDBLimitedLunarRedbagStepHistory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId
  server: string
  role: string
  step: number
}

export interface IDBLimitedLunarPieceHistory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId
  piece: string
}

export interface IDBLimitedLunarPieceRewardHistory {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  user: Types.ObjectId
  server: string
  role: string
  pieces: Array<string>
}
