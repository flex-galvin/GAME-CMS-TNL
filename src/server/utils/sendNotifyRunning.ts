import { IDBUser } from '~~/types'

const typeTitle : Record<number, string> = {
  1: 'Trưởng lão',
  2: 'Đan sư',
  3: 'Tông chủ',
}

const userTitle = (user : IDBUser) : string => {
  if(!!user.type && user.type> 0) return typeTitle[user.type]
  if(!!user.level) return user.level.title || 'Cường giả'
  return 'Ngoại môn'
}

export default (user : IDBUser | null, content: string) => {
  if(!user){
    return IO && IO.emit('notify-running-push', { user: null, content: content })
  }
  else {
    const contentUser = `${userTitle(user)}【${user.username || 'Ẩn Danh'}】${content}` 
    return IO && IO.emit('notify-running-push', { user: user, content: contentUser })
  }
}