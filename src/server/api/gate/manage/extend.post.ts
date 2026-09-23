import type { IAuth, IDBConfig, IDBGate } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'gate.edit')

    const config = await DB.Config.findOne().select('telegram name') as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình'

    const body = await readBody(event)
    const { _id } = body
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const gate = await DB.Gate.findOne({ _id: _id }).select('name person number') as IDBGate
    if(!gate) throw 'Kênh không tồn tại'

    delete body['_id']
    await DB.Gate.updateOne({ _id: _id }, body)

    if(!!config.telegram && !!config.telegram.manage){
      const IP = getRequestIP(event, { xForwardedFor: true })
      await sendTele({
        url: config.telegram.manage,
        message: `
          Thông báo sửa tiện ích kênh nạp
          » Trò chơi: ${config.name}
          » Thực hiện bởi: ${auth.username}
          » Kênh nạp sửa: [${gate.name}] ${gate.person} - ${gate.number}
          » IP thực hiện: ${IP}
        `
      })
    }

    await logAdmin(event, `Sửa tiện ích kênh nạp <b>${gate.name}</b>`)
    return resp(event, { message: 'Sửa tiện ích kênh thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})