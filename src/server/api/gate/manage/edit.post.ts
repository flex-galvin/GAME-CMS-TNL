import type { IAuth, IDBConfig, IDBGate } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'gate.edit')

    const config = await DB.Config.findOne().select('telegram name') as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình'

    const body = await readBody(event)
    const { _id, name, person, number } = body
    if(!_id || !name || !person || !number) throw 'Dữ liệu đầu vào không hợp lệ'
    const gate = await DB.Gate.findOne({ _id: _id }).select('name person number') as IDBGate
    if(!gate) throw 'Kênh không tồn tại'

    delete body['_id']
    await DB.Gate.updateOne({ _id: _id }, body)

    if(!!config.telegram && !!config.telegram.manage){
      const IP = getRequestIP(event, { xForwardedFor: true })
      await sendTele({
        url: config.telegram.manage,
        message: `
          Thông báo sửa thông tin kênh nạp
          » Trò chơi: ${config.name}
          » Thực hiện bởi: ${auth.username}
          » Thông tin cũ: [${gate.name}] ${gate.person} - ${gate.number}
          » Thông tin mới: [${name}] ${person} - ${number}
          » IP thực hiện: ${IP}
        `
      })
    }

    await logAdmin(event, `Sửa thông tin kênh nạp <b>${gate.name}</b>`)
    return resp(event, { message: 'Sửa kênh thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})