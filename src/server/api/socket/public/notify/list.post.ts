import type { IAuth } from '~~/types'

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    const { size, skip } = await readBody(event)
    const match : any = { user: auth._id }

    const list = await DB.LogUser
    .find(match)
    .sort({ createdAt: -1 })
    .limit(size)
    .skip(skip)

    await DB.LogUser.updateMany({ _id: { $in: list.map(i => i._id) } }, { $set: { watched: true } })

    const total = await DB.LogUser.count(match)
    return resp(event, { result: { list, total }})
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})