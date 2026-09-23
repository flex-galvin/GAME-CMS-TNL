import type { IDBConfig, IDBUser } from '~~/types'

export default (config: IDBConfig, user : IDBUser) : number => {
  if(!config) return 0
  if(!user.vip) return 0
  if(!user.vip.enable) return 0

  if(user.vip.type == 'forever') return config.vip.discount.shop || 0
  if(user.vip.type == 'day'){
    if(!user.vip.end) return 0
    
    const now = dayjs().unix()
    const expired = dayjs(user.vip.end).unix()

    if(now <= expired) return config.vip.discount.shop || 0
    return 0
  }
  return 0
}