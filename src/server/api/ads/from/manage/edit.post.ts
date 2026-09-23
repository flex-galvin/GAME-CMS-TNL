import type { IAuth, IDBAdsFrom } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'ads.edit')

    const body = await readBody(event)
    const { _id, code, note } = body
    if(!_id || !code || !note) throw 'Dữ liệu đầu vào không hợp lệ'

    const from = await DB.AdsFrom.findOne({ _id: _id }).select('code') as IDBAdsFrom
    if(!from) throw 'Nguồn không tồn tại'

    if(from.code != code){
      const checkDup = await DB.AdsFrom.findOne({ code: code }).select('_id') as IDBAdsFrom
      if(!!checkDup) throw 'Tên mã nguồn đã tồn tại'
    }

    delete body['_id']
    await DB.AdsFrom.updateOne({ _id: _id }, body)
    
    await logAdmin(event, `Sửa nguồn quảng cáo mã <b>${from.code}</b>`)
    return resp(event, { message: 'Sửa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})