import type { IAuth, IDBConfig, IDBGameMission, IDBGameMissionHistory, IDBItem } from '~~/types'
import axios from 'axios'

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { _id, server, role } = body
    if(!_id) throw 'Không tìm thấy ID nhiệm vụ'
    if(!server) throw 'Không tìm thấy ID máy chủ'
    if(!role) throw 'Không tìm thấy ID nhân vật'

    const config = await DB.Config.findOne().select('game enable') as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình trò chơi'
    if(!config.game.api.roles) throw 'Hệ thống chưa khả dụng để nhận thưởng'
    if(!config.enable.play) throw 'Trò chơi đang bảo trì, vui lòng quay lại sau'

    // Giftcode
    const mission = await DB.GameMission.findOne({ _id: _id })
    .select('need server type gift')
    .populate({
      path: 'gift.item',
      select: 'item_id type'
    }) as IDBGameMission
    if(!mission) throw 'Mốc nhiệm vụ không tồn tại'
    if(mission.gift.length == 0) throw 'Nhiệm vụ chưa có phần thưởng để nhận'

    // Check Servers
    if(server != mission.server) throw 'Máy chủ không phù hợp'

    // Check History
    const historyReceive = await DB.GameMissionHistory.findOne({ 
      mission: mission._id ,
      user: auth._id,
      server: server,
      role: role
    }) as IDBGameMissionHistory
    if(!!historyReceive) throw 'Nhân vật của máy chủ này đã nhận thưởng rồi'

    // Check Role
    const post = {
      secret: config.game.secret,
      server_id: mission.server,
      size: 1, current: 1,
      sort: { column: 'power', direction: 'desc' },
      search: { key: role, by: 'ID' },
    }
    const send = await axios.post(config.game.api.roles, post, {
      timeout: 10_000
    })
    const res = send.data
    if(res.error) throw res.error
    const roles = res.data.list
    if(roles.length != 1) throw 'Không lấy được chỉ số nhân vật được chọn'
    const roleCheck = roles[0]
    if(!roleCheck.account || roleCheck.account != auth.username || !roleCheck[`${mission.type}`]) throw 'Nhân vật không khả dụng để nhận thưởng'
    if(roleCheck[`${mission.type}`] < mission.need) throw 'Nhân vật không đủ điều kiện nhận thưởng'

    // Format Gift
    const giftItem : Array<any> = []
    const giftCurrency : any = {}

    mission.gift.forEach(gift => {
      const item = gift.item as IDBItem
      if(item.type == 'game_item') giftItem.push({ id: item.item_id, amount: gift.amount })
      if(!!['coin', 'wheel'].includes(item.type)) giftCurrency[`currency.${item.type}`] = gift.amount
    })

    // Send Gift
    if(giftItem.length > 0) await gameSendMail(event, {
      account: auth.username,
      server_id: server,
      role_id: role,
      title: 'Web Mission ' + (mission.type == 'level' ? 'Level' : 'Power'),
      content: `Vật phẩm nhận từ nhiệm vụ trên web khi đạt ${mission.type == 'level' ? 'cấp độ' : 'lực chiến'} ${mission.need.toLocaleString("vi-VN")}`,
      items: giftItem
    })
      
    if(Object.keys(giftCurrency).length) await DB.User.updateOne({ _id: auth._id },{ $inc: giftCurrency })

    // History
    await DB.GameMissionHistory.create({
      mission: mission._id ,
      user: auth._id,
      server: server,
      role: role
    })

    // Log User
    await logUser(event, auth._id, `Nhận thưởng nhiệm vụ đạt ${mission.type == 'level' ? 'cấp độ' : 'lực chiến'} ${mission.need.toLocaleString("vi-VN")} tại máy chủ <b>${server}</b> với nhân vật <b>${role}</b>`)
    !!IO && IO.to(auth._id.toString()).emit('auth-update')
    
    return resp(event, { message: 'Nhận thưởng thành công' })
  } 
  catch (e:any) {
    if (axios.isAxiosError(e) && e.code === 'ECONNABORTED') {
      throw 'Quá thời gian gọi API cho phép'
    }
    return resp(event, { code: 400, message: e.toString() })
  }
})