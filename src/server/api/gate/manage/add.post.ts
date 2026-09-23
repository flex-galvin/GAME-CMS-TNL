import type { IAuth, IDBConfig } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'gate.add')

    const config = await DB.Config.findOne().select('telegram name') as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình'

    const body = await readBody(event)
    const { type, name, person, number } = body
    if(!type || !name || !person || !number) throw 'Dữ liệu đầu vào không hợp lệ'
    if(type < 1 || type > 3) throw 'Dữ liệu đầu vào không hợp lệ'

    await DB.Gate.create(body)

    if(!!config.telegram && !!config.telegram.manage){
      const IP = getRequestIP(event, { xForwardedFor: true })
      await sendTele({
        url: config.telegram.manage,
        message: `
          Thông báo thêm kênh nạp mới
          » Trò chơi: ${config.name}
          » Thực hiện bởi: ${auth.username}
          » Kênh nạp: ${name}
          » Số tài khoản: ${number}
          » Chủ sở hữu: ${person}
          » IP thực hiện: ${IP}
        `
      })
    }

    await logAdmin(event, `Thêm kênh nạp <b>${name}</b>`)
    return resp(event, { message: 'Thêm kênh thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})