import type { IAuth } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'config.update')

    const data = await readBody(event)
    const { change, logo_image, game, enable, notice } = data
    if(!change) throw 'Dữ liệu đầu vào không hợp lệ'

    // Notice
    if(change == 'notice'){
      if(!!notice.content && notice.content != '<p></p>'){
        if(!notice.time) throw 'Thời gian thông báo không hợp lệ'
        if(!notice.time.start || !notice.time.end) throw 'Thời gian thông báo không hợp lệ'
      }
      notice.version = new Date()
    }
    
    // Game API
    if(change == 'game'){
      if(!!game.ip){
        data.game.api = {
          start: `http://${game.ip}/api/action/start.php`,
          server: `http://${game.ip}/api/action/server.php`,
          role: `http://${game.ip}/api/action/role.php`,
          roles: `http://${game.ip}/api/action/roles.php`,
          rank_level: `http://${game.ip}/api/action/rank_level.php`,
          rank_power: `http://${game.ip}/api/action/rank_power.php`,
          mail: `http://${game.ip}/api/action/mail.php`,
          recharge: `http://${game.ip}/api/action/recharge.php`,
          os: `http://${game.ip}/api/action/os.php`,
          reg: game.api ? game.api.reg : ''
        }
      }
    }

    // Referral
    if(change == 'enable'){
      if(!enable.referral) data.menu.event.referral = false
      data.homepage.landing = !!data.homepage.landing ? data.homepage.landing : null
    }

    // Update
    delete data['_id']
    delete data['change']
    delete data['permission']
    await DB.Config.updateMany({}, data)
    if(!!logo_image) await DB.User.updateMany({ avatar: '/images/user/default.png' }, { avatar: logo_image })
    if(change == 'enable' && !enable.play) !!IO && IO.emit('notice-reload', 'Trò chơi sắp bảo trì, vui lòng quay lại sau !')

    // Save Log
    if(change == 'enable') await logAdmin(event, 'Cập nhật cài đặt <b>Kích Hoạt Tính Năng</b>')
    if(change == 'basic') await logAdmin(event, 'Cập nhật thông tin <b>Cơ Bản</b> trang web')
    if(change == 'contact') await logAdmin(event, 'Cập nhật thông tin <b>Liên Hệ</b> trang web')
    if(change == 'social') await logAdmin(event, 'Cập nhật thông tin <b>Mạng Xã Hội</b> trang web')
    if(change == 'game') await logAdmin(event, 'Cập nhật cấu hình <b>Trò Chơi</b>')
    if(change == 'facebook') await logAdmin(event, 'Cập nhật cấu hình <b>API Facebook</b>')
    if(change == 'google') await logAdmin(event, 'Cập nhật cấu hình <b>API Google</b>')
    if(change == 'zalo') await logAdmin(event, 'Cập nhật cấu hình <b>API Zalo</b>')
    if(change == 'tiktok') await logAdmin(event, 'Cập nhật cấu hình <b>API Tiktok</b>')
    if(change == 'telegram') await logAdmin(event, 'Cập nhật cấu hình <b>API Telegram</b>')
    if(change == 'cloudflare') await logAdmin(event, 'Cập nhật cấu hình <b>API Cloudflare</b>')
    if(change == 'menu') await logAdmin(event, 'Cập nhật cấu hình <b>Danh Mục Trang</b>')
    if(change == 'thankyou') await logAdmin(event, 'Cập nhật cấu hình <b>Thank You</b>')
    if(change == 'promo') await logAdmin(event, 'Cập nhật cấu hình <b>Khuyến Mãi</b>')
    if(change == 'notiruning') await logAdmin(event, 'Cập nhật cấu hình <b>Thông Báo Chạy</b>')
    if(change == 'vip') await logAdmin(event, 'Cập nhật cấu hình <b>Hệ Thống VIP</b>')

    // Clear Cache
    const REDIS_PREFIX = runtimeConfig.redisPREFIX || 'default'
    if(DBRedis) await Promise.allSettled([
      DBRedis.del(`${REDIS_PREFIX}:config:public`),
      DBRedis.del(`${REDIS_PREFIX}:config:promo`),
      DBRedis.del(`${REDIS_PREFIX}:config:home`),
    ])

    // Socket Update All
    !!IO && IO.emit('config-update')
    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})