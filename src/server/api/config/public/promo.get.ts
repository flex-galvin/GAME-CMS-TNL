import { IDBConfig, IDBPaymentConfig, IDBShopConfig } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const REDIS_KEY = `${runtimeConfig.redisPREFIX || 'default'}:config:promo`
    const REDIS_TTL = 24 * 60 * 60 // 24h
    
    // Cố gắng lấy từ Redis trước
    if(DBRedis){
      const cached = await DBRedis.get(REDIS_KEY)
      if(!!cached) return resp(event, { result: JSON.parse(cached) })
    }

    // Nếu không có trong Redis, lấy từ cơ sở dữ liệu
    const result : any = {
      register: {
        coin: 0
      },
      payment: {
        first: 0,
        second: 0,
        pay: {
          number: 0,
          expired: null
        },
        happyhour: {
          start: null,
          end: null,
          number: 0
        }
      },
      shop: {
        discount: {
          number: 0,
          expired: null
        }
      }
    }

    const config = await DB.Config.findOne().select('promo') as IDBConfig
    if(!!config){
      result.register.coin = config.promo.register.coin
      result.payment.first = config.promo.payment.first
      result.payment.second = config.promo.payment.second
    }

    const paymentConfig = await DB.PaymentConfig.findOne().select('happyhour pay') as IDBPaymentConfig
    if(!!paymentConfig){
      result.payment.happyhour = paymentConfig.happyhour
      result.payment.pay = paymentConfig.pay
    }
    
    const shopConfig = await DB.ShopConfig.findOne().select('discount') as IDBShopConfig
    if(!!shopConfig){
      result.shop.discount = shopConfig.discount
    }

    // Lưu vào Redis để cache
    DBRedis && await DBRedis.set(REDIS_KEY, JSON.stringify(result), 'EX', REDIS_TTL)

    return resp(event, { result: result })
  } 
  catch (e:any) {
    return resp(event, { result: null })
  }
})