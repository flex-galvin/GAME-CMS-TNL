import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const list = await DB.Level
    .find()
    .sort({ 'number': 1 })
    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})