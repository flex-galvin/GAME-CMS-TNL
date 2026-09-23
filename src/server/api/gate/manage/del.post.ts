import type { IAuth, IDBConfig, IDBGate } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'gate.del')

    const config = await DB.Config.findOne().select('telegram name') as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình'

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const gate = await DB.Gate.findOne({ _id: _id }).select('name person number') as IDBGate
    if(!gate) throw 'Kênh không tồn tại'

    const payments = await DB.Payment.count({ gate: _id })
    if(payments > 0) throw 'Không thể xóa kênh đã có giao dịch'

    await DB.Gate.deleteOne({ _id: _id })

    if(!!config.telegram && !!config.telegram.manage){
      const IP = getRequestIP(event, { xForwardedFor: true })
      await sendTele({
        url: config.telegram.manage,
        message: `
          Thông báo xóa kênh nạp
          » Trò chơi: ${config.name}
          » Thực hiện bởi: ${auth.username}
          » Kênh nạp xóa: [${gate.name}] ${gate.person} - ${gate.number}
          » IP thực hiện: ${IP}
        `
      })
    }

    await logAdmin(event, `Xóa kênh nạp <b>${gate.name}</b>`)
    return resp(event, { message: 'Xóa kênh thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})