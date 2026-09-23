import type { Types } from 'mongoose'
import type { IDBItem } from './game'

export interface IDBConfig {
  _id: Types.ObjectId
  createdAt: Date
  updatedAt: Date

  name: string
  short_name: string
  description: string
  og_image: string
  logo_image: string
  logo_long_image: string
  makeby: string
  about: string
  privacy: string
  terms: string
  gm_password: string
  more_game: string
  license: boolean
  notice: {
    title: string
    description: string
    content: string
    time: {
      start: string
      end: string
    }
    version: Date
  }
  notiruning: {
    helloworld: string
    access: {
      role: number
      level: number
    }
    pay: number
  }
  menu: {
    about: {
      level: boolean
    }
    action: {
      payment: boolean
      giftcode: boolean
      vip: boolean
    }
    shop: {
      pack: boolean
      item: boolean
      recharge: boolean
    }
    event: {
      powerup: boolean
      referral: boolean
      login: boolean
      pay: boolean
      spend: boolean
      paymusty: boolean
      paydays: boolean
    }
    minigame: {
      wheel: boolean
      egg: boolean
    }
    rank: {
      level: boolean
      power: boolean
    }
  }
  vip: {
    price: {
      week: number
      month: number
    }
    gift: Array<{
      item: Types.ObjectId | IDBItem,
      amount: number
    }>
    bonus: {
      pay: number
    }
    discount: {
      shop: number
    }
  }
  enable: {
    signin: boolean
    signup: boolean
    play: boolean
    referral: boolean
    landing: boolean
    signup_count: number
  }
  homepage: {
    landing: Types.ObjectId
  }
  thankyou: {
    link: string
  }
  download: {
    apk: string
    ios: string
  }
  contact: {
    name: string
    phone: string
    email: string
    address: string
    prefix: string
  }
  social: {
    facebook: string
    messenger: string
    zalo: string
    telegram: string
    tiktok: string
  }
  promo: {
    register: {
      coin: number
    }
    payment: {
      first: number
      second: number
    }
  }
  game: {
    ip: string
    mobile: boolean
    hangup: boolean
    landscape: boolean
    image: string
    secret: string
    ssl: boolean
    api: {
      start: string
      role: string
      roles: string
      server: string
      rank_power: string
      rank_level: string
      mail: string
      recharge: string
      os: string
      reg: string
    }
  }
  permission: {
    config: {
      update: Array<number>
      action: Array<number>
    }
    news: {
      add: Array<number>
      edit: Array<number>
      del: Array<number>
    },
    ads: {
      add: Array<number>
      edit: Array<number>
      del: Array<number>
    }
    IP: {
      user: {
        action: Array<number>
      }
      whitelist: {
        add: Array<number>
        edit: Array<number>
        del: Array<number>
      }
    }
    item: {
      add: Array<number>
      edit: Array<number>
      del: Array<number>
      export: Array<number>
    }
    user: {
      editAuth: Array<number>
      editCurrency: Array<number>
      editPay: Array<number>
      editSpend: Array<number>
      editLogin: Array<number>
      reset: Array<number>
      del: Array<number>
      export: Array<number>
    }
    level: {
      edit: Array<number>
    }
    gate: {
      add: Array<number>
      edit: Array<number>
      del: Array<number>
    }
    payment: {
      configUpdate: Array<number>
      verify: Array<number>
      undo: Array<number>
    }
    spend: {
      add: Array<number>
      edit: Array<number>
      del: Array<number>
    }
    shop: {
      configUpdate: Array<number>
      add: Array<number>
      edit: Array<number>
      del: Array<number>
    }
    event: {
      add: Array<number>
      edit: Array<number>
      del: Array<number>
      delHistory: Array<number>
    }
    limited: {
      update: Array<number>
    }
    giftcode: {
      add: Array<number>
      edit: Array<number>
      del: Array<number>
      delHistory: Array<number>
    }
    wheel: {
      add: Array<number>
      edit: Array<number>
      del: Array<number>
    }
    egg: {
      update: Array<number>
    }
    game: {
      sendItem: Array<number>
    }
  }
  facebook: {
    client_id: string
    client_secret: string
    client_version: string
    client_verify: string
    client_ads: string
  }
  google: {
    client_id: string
    client_secret: string
    client_verify: string
    client_ads: string
  }
  tiktok: {
    client_id: string
    client_secret: string
    client_verify: string
  }
  zalo: {
    client_id: string
    client_secret: string
    client_verify: string
  }
  telegram: {
    payment: string
    manage: string
  }
  cloudflare: {
    site_key: string
    secret_key: string
  }
}

export interface IDBConfigStore {
  name: string
  short_name: string
  description: string
  og_image: string
  logo_image: string
  logo_long_image: string
  makeby: string
  notice: {
    title: string
    description: string
    content: string
    time: {
      start: string
      end: string
    }
    version: Date | null
  }
  notiruning: {
    helloworld: string
  }
  menu: {
    about: {
      level: boolean
    }
    action: {
      payment: boolean
      giftcode: boolean
      vip: boolean
    }
    shop: {
      pack: boolean
      item: boolean
      recharge: boolean
    }
    event: {
      powerup: boolean
      referral: boolean
      login: boolean
      pay: boolean
      spend: boolean
      paymusty: boolean
      paydays: boolean
    }
    minigame: {
      wheel: boolean
      egg: boolean
    }
    rank: {
      level: boolean
      power: boolean
    }
  }
  vip: {
    price: {
      week: number
      month: number
    }
    gift: Array<{
      item: Types.ObjectId | IDBItem,
      amount: number
    }>
    bonus: {
      pay: number
    }
    discount: {
      shop: number
    }
  }
  enable: {
    signin: boolean
    signup: boolean
    play: boolean
    referral: boolean
    landing: boolean
  }
  thankyou: {
    link: string
  }
  download: {
    apk: string
    ios: string
  }
  contact: {
    name: string
    phone: string
    email: string
    address: string
    prefix: string
  }
  social: {
    facebook: string
    messenger: string
    zalo: string
    telegram: string
    tiktok: string
  }
  promo: {
    register: {
      coin: number
    }
    payment: {
      first: number
      second: number
    }
  }
  game: {
    mobile: boolean
    hangup: boolean
    landscape: boolean
    ssl: boolean
    image: string
  }
  facebook: {
    client_id: string
    client_version: string
    client_verify: string
    client_ads: string
  }
  google: {
    client_id: string
    client_verify: string
    client_ads: string
  }
  tiktok: {
    client_id: string
    client_verify: string
  }
  zalo: {
    client_id: string
    client_verify: string
  }
  cloudflare: {
    site_key: string
  }
}