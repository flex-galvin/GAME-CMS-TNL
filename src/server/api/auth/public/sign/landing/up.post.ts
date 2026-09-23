import jwt from 'jsonwebtoken'
import md5 from 'md5'
import type { IDBAdsFrom, IDBAdsLanding, IDBConfig, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()

    // Config
    const config = await DB.Config.findOne({}).select('logo_image contact enable game promo cloudflare') as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình trang'
    if(!config.enable.signup) throw 'Chức năng đăng ký đang bảo trì'

    // Check IP
    const IP = getRequestIP(event, { xForwardedFor: true })
    const adminIP = await DB.AdminIP.count({ ip: IP })
    if(adminIP == 0){
      const logIP = await DB.LogUserIP.count({ ip: IP })
      if(logIP > config.enable.signup_count) throw 'IP đã vượt quá giới hạn tạo tài khoản'
    }

    // Validate Data
    const { username, password, confirm_password, landing, captcha } = await readBody(event)
    if (!username) throw 'Vui lòng nhập tài khoản'
    if (username.length < 6 || username.length > 12) throw 'Tài khoản trong khoảng 6-12 ký tự'
    if (!!username.match(/\s/g)) throw 'Tài khoản không có khoảng cách'
    if (!(/^[a-z0-9]*$/g).test(username)) throw 'Tài khoản không có ký tự đặc biệt và viết hoa'
    if (!!username.includes('admin')
      || !!username.includes('smod')
      || !!username.includes('robot')
    ) throw 'Tài khoản không hợp lệ'
    if (!password) throw 'Vui lòng nhập mật khẩu'
    if (password.length < 6 || password.length > 15) throw 'Mật khẩu trong khoảng 6-15 ký tự'
    if (!!password.match(/\s/g)) throw 'Mật khẩu không có khoảng cách'
    if (!confirm_password) throw 'Vui lòng nhập mật khẩu xác nhận'
    if (password != confirm_password) throw 'Mật khẩu xác nhận không khớp'

    // Validate Captcha
    if (!!config.cloudflare.site_key && !!config.cloudflare.secret_key && !captcha) throw 'Vui lòng xác thực Captcha'
    if (!!config.cloudflare.site_key && !!config.cloudflare.secret_key && !!captcha) await verifyCFTurnstile(config.cloudflare.secret_key, captcha, IP)

    // Check Landing
    const landingData = await DB.AdsLanding.findOne({ _id: landing }).select('code') as IDBAdsLanding
    if(!landingData) throw 'Mã Landing không tồn tại'

    // Check User
    const userCheck = await DB.User.findOne({ username: username }).select('username') as IDBUser
    if(!!userCheck) throw 'Tài khoản đã tồn tại'

    // Create
    const referral : any = { code: `${config.contact.prefix || 'GAME'}-${username.toUpperCase()}` }
    const user = await DB.User.create({
      username: username,
      password: md5(password),
      avatar: config.logo_image || '/images/user/default.png',
      reg: {
        landing: landingData._id
      },
      referral: referral,
      currency: {
        coin: config.promo.register.coin > 0 ? config.promo.register.coin : 0,
      }
    }) as IDBUser

    // Make Token And Cookie
    const token = jwt.sign({
      _id : user._id
    }, runtimeConfig.apiSecret, { expiresIn: '360d' })

    setCookie(event, 'token-auth', token, runtimeConfig.public.cookieConfig)
    user.token = token
    await user.save()

    // Save IP
    await DB.LogUserIP.create({ user: user._id, ip: IP })

    // Update Ads From
    const adsFromCode = getCookie(event, 'ads-from')
    if(!!adsFromCode){
      const adsFromData = await DB.AdsFrom.findOne({ code: adsFromCode }).select('_id') as IDBAdsFrom
      if(!!adsFromData) await DB.AdsFrom.updateOne({ _id: adsFromData._id }, { $inc: { 'sign.up': 1 }})
      else deleteCookie(event, 'ads-from', runtimeConfig.public.cookieConfig)
    }

    // Update Landing
    await DB.AdsLanding.updateOne({ _id: landing }, { $inc: { 'sign.up': 1 }})

    // Save Log And Send Notify
    await logUser(event, user._id, `Đăng ký tài khoản nhanh tại Landing <b>${landingData.code}</b> với IP <b>${IP}</b>`)
    if(config.promo.register.coin > 0) await logUser(event, user._id, `Nhận <b>${config.promo.register.coin.toLocaleString('vi-VN')}</b> từ khuyến mãi đăng ký tài khoản mới`)
    await createChat(event, 'bot', `Chào mừng thành viên mới ${formatHideString(user.username)}`)

    return resp(event, { message: 'Đăng ký thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})