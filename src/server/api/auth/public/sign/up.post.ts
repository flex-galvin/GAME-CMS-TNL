import jwt from 'jsonwebtoken'
import md5 from 'md5'
import type { IDBAdsFrom, IDBConfig, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()

    // Config
    const config = await DB.Config.findOne({}).select('logo_image contact enable game promo cloudflare') as IDBConfig
    if(!config) throw 'Không tìm thấy cấu hình trang'
    if(!config.enable.signup) throw 'Chức năng đăng ký đang bảo trì'

    // Check IP
    const IP = getRequestIP(event, { xForwardedFor: true })
    const isAdminIP = await DB.AdminIP.count({ ip: IP })
    if(isAdminIP == 0){
      const logIP = await DB.LogUserIP.count({ ip: IP })
      if(logIP > config.enable.signup_count) throw 'IP đã vượt quá giới hạn tạo tài khoản'
    }

    // Validate Data
    const { username, password, email, phone, referral_code, captcha } = await readBody(event)
    if (!username) throw 'Vui lòng nhập tài khoản'
    if (username.length < 6 || username.length > 12) throw 'Tài khoản trong khoảng 6-12 ký tự'
    if (!!username.match(/\s/g)) throw 'Tài khoản không có khoảng cách'
    if (!(/^[a-z0-9]*$/g).test(username)) throw 'Tài khoản không có ký tự đặc biệt và viết hoa'
    if (!!username.includes('admin')
      || !!username.includes('smod')
      || !!username.includes('robot')
    ) throw 'Tài khoản không hợp lệ'
    if (!email) throw 'Vui lòng nhập Email'
    if (!email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) throw 'Định dạng Email không đúng'
    if (!phone) throw 'Vui lòng nhập số điện thoại'
    if (!phone.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)) throw 'Định dạng số điện thoại không đúng'
    if (!password) throw 'Vui lòng nhập mật khẩu'
    if (password.length < 6 || password.length > 15) throw 'Mật khẩu trong khoảng 6-15 ký tự'
    if (!!password.match(/\s/g)) throw 'Mật khẩu không có khoảng cách'

    // Validate Captcha
    if (!!config.cloudflare.site_key && !!config.cloudflare.secret_key && !captcha) throw 'Vui lòng xác thực Captcha'
    if (!!config.cloudflare.site_key && !!config.cloudflare.secret_key && !!captcha) await verifyCFTurnstile(config.cloudflare.secret_key, captcha, IP)

    // Check User
    const userCheck = await DB.User
    .findOne({ 
      $or: [
        { username: username },
        { phone: phone },
        { email: email }
      ]
    })
    .select('username email phone') as IDBUser
    
    if(!!userCheck){
      if(userCheck.username == username) throw 'Tài khoản đã tồn tại'
      if(userCheck.phone == phone) throw 'Số điện thoại đã tồn tại'
      if(userCheck.email == email) throw 'Địa chỉ Email đã tồn tại'
    }

    // Check Referral Code
    const referral : any = { code: `${config.contact.prefix || 'GAME'}-${username.toUpperCase()}` }
    if(!!referral_code){
      const referraler = await DB.User.findOne({ 'referral.code': referral_code }).select('_id') as IDBUser
      if(!referraler) throw 'Mã mời không tồn tại'
      
      referral.person = referraler._id
    }

    // Reg Game
    if(!!config.game.api.reg) await gameReg(event, { username: username, password: password })

    // Create
    const user = await DB.User.create({
      username: username,
      password: md5(password),
      phone: phone,
      email: email,
      avatar: config.logo_image || '/images/user/default.png',
      referral: referral,
      currency: {
        coin: config.promo.register.coin > 0 ? config.promo.register.coin : 0,
      }
    }) as IDBUser

    // Update To Referraler
    !!referral.person && await DB.User.updateOne({ _id: referral.person }, { $inc: { 'referral.count': 1 }})

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

    // Send Notify and Save Log
    await logUser(event, user._id, 'Đăng ký tài khoản')
    if(config.promo.register.coin > 0) await logUser(event, user._id, `Nhận <b>${config.promo.register.coin.toLocaleString('vi-VN')}</b> từ khuyến mãi đăng ký tài khoản mới`)
    await createChat(event, 'bot', `Chào mừng thành viên mới ${formatHideString(user.username)}`)
    
    return resp(event, { message: 'Đăng ký thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})