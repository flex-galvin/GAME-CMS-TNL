import type { IAuth, IDBAdsFrom } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'ads.add')

    const body = await readBody(event)
    const { code, note } = body
    if(!code || !note) throw 'Dữ liệu đầu vào sai'

    const checkDup = await DB.AdsFrom.findOne({ code: code }).select('_id') as IDBAdsFrom
    if(!!checkDup) throw 'Tên mã nguồn đã tồn tại'

    await DB.AdsFrom.create(body)
    
    await logAdmin(event, `Thêm nguồn quảng cáo mã <b>${code}</b>`)
    return resp(event, { message: 'Thêm thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})