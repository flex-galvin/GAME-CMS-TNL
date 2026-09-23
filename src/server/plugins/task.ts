import cron from 'node-cron'

export default defineNitroPlugin(() => {
  // Trả thưởng đua TOP lực chiến máy chủ 23h mỗi ngày
  cron.schedule('00 23 * * *', async () => {
    try {
      await rankProcessAward()
    }
    catch (e : any) {
      await DB.LogCron.create({ type: 'cron23h00OfDay', action: e.toString() })
    }
  }, {
    timezone: 'Asia/Ho_Chi_Minh'
  })

  // Ghi lực chiến nhân vật sự kiện đua TOP tăng lực chiến mỗi 1 tiếng từ 0h30 đến 23h30
  cron.schedule('30 * * * *', async () => {
    try {
      await rankPowerUpProcessWrite()
    }
    catch (e : any) {
      await DB.LogCron.create({ type: 'cron23h30OfDay', action: e.toString() })
    }
  }, {
    timezone: 'Asia/Ho_Chi_Minh'
  })

  // Trả thưởng sự kiện đua TOP tăng lực chiến 23h45 mỗi ngày
  cron.schedule('45 23 * * *', async () => {
    try {
      await rankPowerUpProcessAward()
    }
    catch (e : any) {
      await DB.LogCron.create({ type: 'cron23h45OfDay', action: e.toString() })
    }
  }, {
    timezone: 'Asia/Ho_Chi_Minh'
  })
})