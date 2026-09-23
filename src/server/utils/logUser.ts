import type { H3Event } from 'h3'
import type { Types } from 'mongoose'

export default async (event: H3Event | null, user: Types.ObjectId, action: string) => {
  try {
    const log = await DB.LogUser.create({ user: user, action: action })
    !!IO && IO.to(user.toString()).emit('notify-single-push', log)
  }
  catch(e){
    return
  }
}