import type { IDBGameRankProcess, IDBItem, IDBUser } from '~~/types'

export default async (server? : string) => {
  try {
    const randStart = dayjs().startOf('day').toDate()
    const randEnd = dayjs().endOf('day').toDate()

    const match : any = {
      active: true,                                 // Đã kích hoạt
      processing: false,                            // Không có tiến trình trả thưởng đang chạy
      send: false,                                  // Trạng thái chưa trả thưởng
      end: { $gte: randStart, $lte : randEnd },     // 22h00 <= Kết thúc <= 23h59 (Ngày hiện tại)
      award: { $exists: true, $not: { $size: 0 } }  // Đã cài đặt quà tặng
    }
    if(!!server) {
      match['server'] = server
      delete match['end']
    }

    const listProcess = await DB.GameRankProcess
    .find(match)
    .select('server type award end') 
    .populate({ path: 'award.gift.item', select: 'item_id type'}) as Array<IDBGameRankProcess>

    await Promise.allSettled(listProcess.map(async (processEvent) => {
      // Update Processing
      await DB.GameRankProcess.updateOne({ _id: processEvent._id }, { processing: true })

      const typeInfo = {
        power: { text: 'lực chiến', title: 'Web TOP Power' },
        level: { text: 'cấp độ', title: 'Web TOP Level' }
      }[processEvent.type]

      const ranks = processEvent.type === 'power'
        ? await gameGetRankPower(null, { server_id: processEvent.server }, false)
        : await gameGetRankLevel(null, { server_id: processEvent.server }, false)

      const usernames = ranks.map((role : any) => role.account)
      const users = await DB.User.find({ username: { $in: usernames } }).select('_id username')
      const userMap = new Map(users.map(u => [u.username, u]))
      
      for (const role of ranks) {
        try {
          if(role.rank > 10) throw `Xếp hạng [${role.rank}] không hợp lệ`
          if(role[`${processEvent.type}`] < 1) throw `Chỉ số xếp hạng [${role[`${processEvent.type}`]}] không hợp lệ`

          const awardFormat = JSON.parse(JSON.stringify(processEvent.award))
          const rankAward : any = awardFormat.find((award : any) => award.rank.toString() == role.rank.toString())
          if(!rankAward || (!!rankAward && rankAward.gift.length == 0)) throw `Phần quà cho hạng ${role.rank} chưa được thiết lập`

          const user = userMap.get(role.account) as IDBUser
          if(!user) throw `Không tìm thấy thông tin tài khoản`

          // Format Gift
          const giftItem : Array<any> = []
          const giftCurrency : any = {}
          rankAward.gift.forEach((gift : any) => {
            const item = gift.item as IDBItem
            if(!!item){
              if(item.type == 'game_item') giftItem.push({ id: item.item_id, amount: gift.amount })
              if(!!['coin', 'wheel'].includes(item.type)) giftCurrency[`currency.${item.type}`] = gift.amount
            }
          })

          // Send Gift
          if(giftItem.length > 0) await gameSendMail(null, {
            account: user.username,
            server_id: processEvent.server,
            role_id: role.role_id,
            title: `TOP ${role.rank} - ${typeInfo?.title}`,
            content: `Vật phẩm nhận từ sự kiện đua TOP ${typeInfo?.text} trên website`,
            items: giftItem
          })
          if(Object.keys(giftCurrency).length) await DB.User.updateOne({ _id: user._id },{ $inc: giftCurrency })

          // Log Process
          await DB.GameRankProcessLog.create({
            process: processEvent._id,
            content: `✅ Trả thưởng <b>TOP ${role.rank}</b> cho tài khoản <b>${user.username}</b> với nhân vật <b>[${role.role_id}][${role.role_name}]</b>`
          })

          // Log Receive
          await logUser(null, user._id, `Nhận quà <b>TOP ${role.rank} ${typeInfo?.text}</b> tại máy chủ <b>${processEvent.server}</b>`)
        }
        catch (err : any) {
          await DB.GameRankProcessLog.create({ 
            process: processEvent._id, 
            content: `❌ Lỗi trả thưởng <b>TOP ${role.rank}</b> cho tài khoản <b>${role.account}</b>: ${err.toString()}` 
          })
        }
      }
      
      // Update Process
      await DB.GameRankProcess.updateOne({ _id: processEvent._id }, { send: true, processing: false, active: false })
      await DB.GameRankProcessLog.create({ process: processEvent._id, content: `Trả thưởng đua TOP thành công` })
    }))
  }
  catch (e:any) {
    console.error(`❌ Lỗi trả thưởng TOP tự động: ${e.toString()}`)
  }
}