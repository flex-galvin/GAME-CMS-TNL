import type { IAuth, IDBConfig } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Bạn không phải quản trị viên'
    
    const config = await DB.Config.findOne().select('permission') as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình trang'

    return resp(event, { result: config.permission })
  } 
  catch (e:any) {
    return resp(event, { code: 500, message: e.toString() })
  }
})