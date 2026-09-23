import { defineStore } from 'pinia'
import type { IDBConfigStore } from '~~/types'

export const useConfigStore = defineStore('config', () => {
  const config : IDBConfigStore = reactive({
    name: '...',
    short_name: '...',
    description: '...',
    og_image: '',
    logo_image: '',
    logo_long_image: '',
    makeby: '',
    notice: {
      title: '',
      description: '',
      content: '',
      time: {
        start: '',
        end: '',
      },
      version: null,
    },
    notiruning: {
      helloworld: ''
    },
    menu: {
      about: {
        level: false
      },
      action: {
        payment: false,
        giftcode: false,
        vip: false
      },
      shop: {
        pack: false,
        item: false,
        recharge: false
      },
      event: {
        powerup: false,
        referral: false,
        login: false,
        pay: false,
        spend: false,
        paymusty: false,
        paydays: false
      },
      minigame: {
        wheel: false,
        egg: false
      },
      rank: {
        level: false,
        power: false
      }
    },
    vip: {
      price: {
        week: 0,
        month: 0
      },
      gift: [],
      bonus: {
        pay: 0
      },
      discount: {
        shop: 0
      }
    },
    enable: {
      signin: true,
      signup: true,
      play: true,
      referral: true,
      landing: false
    },
    thankyou: {
      link: '',
    },
    download: {
      apk: '',
      ios: ''
    },
    contact: {
      name: '',
      phone: '',
      email: '',
      address: '',
      prefix: ''
    },
    social: {
      facebook: '',
      messenger: '',
      zalo: '',
      telegram: '',
      tiktok: '',
    },
    promo: {
      register: {
        coin: 0,
      },
      payment: {
        first: 0,
        second: 0
      }
    },
    game: {
      mobile: false,
      hangup: false,
      landscape: false,
      ssl: false,
      image: ''
    },
    facebook: {
      client_id: '',
      client_version: '',
      client_verify: '',
      client_ads: ''
    },
    google: {
      client_id: '',
      client_verify: '',
      client_ads: ''
    },
    tiktok: {
      client_id: '',
      client_verify: '',
    },
    zalo: {
      client_id: '',
      client_verify: '',
    },
    cloudflare: {
      site_key: ''
    }
  })

  const eventLimited : Ref<any> = ref({
    pay: {
      enable: false,
      data: null,
      modal: false
    },
    shop: {
      enable: false,
      data: null,
      modal: false
    },
    halloween: {
      enable: false,
      data: null,
      modal: false
    },
    christmas: {
      enable: false,
      data: null,
      modal: false
    },
    monster: {
      enable: false,
      data: null,
      modal: false
    },
    lootchest: {
      enable: false,
      data: null,
      modal: false
    },
    lunar: {
      enable: false,
      data: null,
      modal: false
    }
  })
  const setEventLimited = (key: string, data : any) => {
    eventLimited.value[key].enable = true
    eventLimited.value[key].data = data
  }
  const removeEventLimited = (key: string) => {
    eventLimited.value[key].enable = false
    eventLimited.value[key].data = null
  }
  const setEventLimitedModal = (key: string, data: boolean) => {
    eventLimited.value[key].modal = data
  }

  const installPrompt : Ref<any> = ref()
  const setInstallPrompt = (data : any) => installPrompt.value = data

  const bootConfig = async () => {
    const cfg : IDBConfigStore = await useAPI('config/public/get')
    Object.assign(config, cfg)
  }

  return { 
    config, bootConfig,
    installPrompt, setInstallPrompt,
    eventLimited, setEventLimited, removeEventLimited, setEventLimitedModal
  }
})