import type { H3Event } from 'h3'
import type { Types } from 'mongoose'
import { IDBConfig, IDBGate, IDBLevel, IDBPayment, IDBPaymentConfig, IDBUser } from '~~/types'

interface IBodyData {
  _id: Types.ObjectId,
  status: number,
  money: number,
  reason: string
}

export default async (
  event: H3Event, 
  { _id, status, money, reason } : IBodyData, 
  verifier? : Types.ObjectId,
  sendNotify : boolean = true
) : Promise<void> => {
  if(!_id) throw 'Không tìm thấy ID giao dịch'
  if(
    !!isNaN(parseInt(String(status))) 
    || parseInt(String(status)) < 1 
    || parseInt(String(status)) > 2
  ) throw 'Mã trạng thái không hợp lệ'
  if(
    !!isNaN(parseInt(String(money))) 
    || parseInt(String(money)) < 0 
  ) throw 'Số tiền không hợp lệ'
  if(status == 2 && !reason) throw 'Không tìm thấy lý do từ chối'

  // Get Config
  const webConfig = await DB.Config.findOne().select('name vip notiruning contact.prefix promo') as IDBConfig

  // Config Payment
  const paymentConfig = await DB.PaymentConfig.findOne() as IDBPaymentConfig

  // Set Real Value
  const realMoney = parseInt(String(money))
  const realStatus = realMoney == 0 ? 2 : status
  const realReason = reason || 'Giao dịch không hợp lệ'

  // Get Payment
  const payment = await DB.Payment
  .findOne({ _id: _id })
  .select('code gate user status')
  if(!payment) throw 'Giao dịch không tồn tại'
  if(payment.status > 0) throw 'Không thể thao tác trên giao dịch này'

  // Get Other
  const user = await DB.User.findOne({ _id: payment.user })
  .select('type username level vip referral paymusty paydays') 
  .populate({ path: 'level', select: 'number title bonus bonus_wheel' }) as IDBUser
  if(!user) throw 'Không tìm thấy thông tin tài khoản'

  const level = user.level
  if(!level) throw 'Không tìm thấy thông tin cấp độ tài khoản'

  const gate = await DB.Gate.findOne({ _id: payment.gate }).select('bonus name person number type') as IDBGate
  if(!gate) throw 'Không tìm thấy thông tin kênh nạp'

  // Set Verify Person
  const time = new Date()
  let verify_person
  if(!!verifier){
    verify_person = verifier
  }
  else {
    const bot = await DB.User.findOne({'username': 'bot'}).select('_id')
    verify_person = bot._id
  }

  // Check Status
  if(realStatus == 1){
    // Set Frist and Second
    let fristCoin = 0
    let secondCoin = 0
    const countPayDone = await DB.Payment.count({ user: user._id, status: 1 })
    if(countPayDone == 0) fristCoin = Math.floor((realMoney * webConfig.promo.payment.first) / 100) // Tặng thêm Xu cho nạp lần đầu
    if(countPayDone == 1) secondCoin = Math.floor((realMoney * webConfig.promo.payment.second) / 100) // Tặng thêm Xu cho nạp lần 2
    const isHappyHourActive = isInTime(paymentConfig.happyhour.start, paymentConfig.happyhour.end, time) && paymentConfig.happyhour.number > 0
    
    // Bonus Level + Gate + VIP + Happy Hour
    const vipBonus = getVipBonus(webConfig, user)
    const vipCoin = Math.floor(realMoney * (vipBonus / 100))
    const happyHourBonus = (!!isHappyHourActive && fristCoin == 0 && secondCoin == 0) ? paymentConfig.happyhour.number : 0
    const happyhourCoin = Math.floor(realMoney * (happyHourBonus / 100))
    const levelBonus = parseInt(String(level.bonus))
    const gateBonus = (fristCoin == 0 && secondCoin == 0) ? getGateBonus(event, gate.bonus) : 0
    const bonusCoin = Math.floor(realMoney * ((levelBonus + gateBonus) / 100))
    const totalCoin = realMoney + bonusCoin + vipCoin + happyhourCoin + fristCoin + secondCoin

    // Bonus Save Pay
    let bonusSavePay = 0
    if(!!paymentConfig){
      const limitBonusSavePay = parseInt(String(paymentConfig.pay.number || 0))
      const limitExpiredBonusSavePay = paymentConfig.pay.expired

      if(!limitExpiredBonusSavePay) bonusSavePay = limitBonusSavePay
      else {
        const nowTime = dayjs().unix()
        const expiredTime = dayjs(limitExpiredBonusSavePay).unix()
        if(nowTime <= expiredTime) bonusSavePay = limitBonusSavePay
      }
    }
    bonusSavePay = Math.floor(realMoney * (bonusSavePay / 100))

    // Bonus Wheel
    let bonusWheel : number = 0
    const percentBonusWheel = parseInt(String(level.bonus_wheel))
    if(percentBonusWheel > 0) bonusWheel = Math.floor(realMoney / percentBonusWheel)

    // Update User
    await DB.User.updateOne({ _id: payment.user },{
      $inc: {
        'currency.coin': totalCoin,
        'currency.wheel': bonusWheel,
        'pay.total.money': realMoney,
        'pay.day.money': realMoney + bonusSavePay,
        'pay.month.money': realMoney + bonusSavePay
      }
    })

    // Update Pay Musty
    const eventPaymustysActive = await checkEventTime('paymusty')
    if(!eventPaymustysActive) user.paymusty = []
    else {
      const hasMoneyMusty = user.paymusty.find(i => i == realMoney)
      if(!hasMoneyMusty) user.paymusty.push(realMoney)
    }

    // Update Pay Days
    const eventPaydaysActive = await checkEventTime('paydays')
    if(!eventPaydaysActive) user.paydays.day = 0, user.paydays.receive = 0
    else {
      // Get Last Payment (Lấy giao dịch thành công gần nhất được duyệt)
      const lastPaymentDone = await DB.Payment.findOne({ user: user._id, status: 1 })
      .select('verify')
      .sort({ 'verify.time' : -1 })
      .limit(1) as IDBPayment

      // Chưa có bất cứ 1 giao dịch nào được duyệt thành công, đặt về mức ban đầu
      if(!lastPaymentDone || !lastPaymentDone.verify?.time) {
        user.paydays.day = 1, user.paydays.receive = 0
      }
      // Nếu có
      else {
        // Nếu chưa được tính bất cứ liên nạp nào, đặt về mức ban đầu
        if(user.paydays.day == 0) user.paydays.day = 1, user.paydays.receive = 0
        // Nếu đã được tính liên nạp
        else {
          const payNowTime = formatDate(time) // Lấy thời gian giao dịch hiện tại
          const payLastTime = formatDate(lastPaymentDone.verify.time) // Lấy thời gian giao dịch trước đó
          // Nếu khác ngày
          if(payNowTime.day != payLastTime.day || payNowTime.month != payLastTime.month || payNowTime.year !=  payLastTime.year){
            const nowStart = payNowTime.dayjs.startOf('day').unix()
            const lastStart = payLastTime.dayjs.startOf('day').unix()
            
            // Nếu 2 mốc thời gian cách nhau hơn 1 ngày, đặt về mức ban đầu
            if((nowStart - lastStart) > (24 * 60 * 60)) user.paydays.day = 1, user.paydays.receive = 0
            // Nếu 2 mốc thời gian là 2 ngày liền kề thì + 1
            else user.paydays.day += 1
          }
        }
      }
    }

    // Update Diamond Referraler
    let referraler : IDBUser | null = null
    let referralerDiamond = 0
    if(!!user.referral.person){
      referraler = await DB.User
      .findOne({ _id: user.referral.person })
      .select('level username')
      .populate({ path: 'level', select: 'bonus_presentee_pay' }) as IDBUser

      if(!!referraler){
        const diamondBonus = parseInt(String((referraler.level as IDBLevel).bonus_presentee_pay || 0))
        if(diamondBonus > 0){
          referralerDiamond = Math.floor(realMoney * (diamondBonus / 100))

          await DB.User.updateOne({ _id: referraler._id },{ $inc: { 'currency.diamond': referralerDiamond }})
        }
      }
    }

    // Limited Event
    await Promise.allSettled([
      limitedPayPayment(user._id, realMoney, bonusSavePay),
      limitedHalloweenPayment(user._id, realMoney),
      limitedChristmasPayment(user._id, realMoney),
      limitedMonsterPayment(user._id, realMoney),
      limitedLootchestPayment(user._id, realMoney),
      limitedLunarPayment(user._id, realMoney),
    ])

    // Save User
    await user.save(),

    // Log and Referraler
    await Promise.allSettled([
      // User
      logUser(event, user._id, `Nhận <b>${realMoney.toLocaleString('vi-VN')} xu, ${bonusWheel.toLocaleString('vi-VN')} lượt quay</b> từ giao dịch nạp tiền thành công <b>${payment.code}</b>`),
      (bonusCoin > 0) ? logUser(event, user._id, `Tặng thêm <b>${bonusCoin.toLocaleString('vi-VN')} Xu</b> từ khuyến mãi kênh nạp và phúc lợi cấp độ`) : null,
      (vipCoin > 0) ? logUser(event, user._id, `Tặng thêm <b>${vipCoin.toLocaleString('vi-VN')} Xu</b> từ ưu đãi đặc quyền VIP`) : null,
      (happyhourCoin > 0) ? logUser(event, user._id, `Tặng thêm <b>${happyhourCoin.toLocaleString('vi-VN')} Xu</b> từ khuyến mãi nạp giờ vàng`) : null,
      (fristCoin > 0) ? logUser(event, user._id, `Tặng thêm <b>${fristCoin.toLocaleString('vi-VN')} Xu</b> vì nạp lần đầu`) : null,
      (secondCoin > 0) ? logUser(event, user._id, `Tặng thêm <b>${secondCoin.toLocaleString('vi-VN')} Xu</b> vì nạp lần 2`) : null,

      // Referraler
      (referraler && referralerDiamond > 0) ? DB.User.updateOne({ _id: referraler._id },{ $inc: { 'currency.diamond': referralerDiamond }}) : null,
      (referraler && referralerDiamond > 0) ? logUser(event, referraler._id, `
        Nhận được <b>${referralerDiamond.toLocaleString('vi-VN')} Cống Hiến</b> 
        từ giao dịch nạp <b>${realMoney.toLocaleString('vi-VN')} VNĐ</b> 
        của bạn bè <b>${referraler.username}</b>
      `) : null,

      // Admin
      (!!verifier) ? logAdmin(event, `Chấp nhận giao dịch nạp tiền <b>${payment.code}</b> với số tiền <b>${realMoney.toLocaleString('vi-VN')}</b>`, verifier) : null
    ].filter(Boolean))

    // Update Realtime
    realMoney >= webConfig.notiruning.pay && sendNotifyRunning(user, 'vừa đóng góp lượng lớn【Linh Thạch】vào tông môn')
    !!IO && IO.to(user._id.toString()).emit('auth-update')
  }
  else {
    if(!!verifier) await logAdmin(event, `Từ chối giao dịch nạp tiền <b>${payment.code}</b> với lý do <b>${realReason}</b>`, verifier)
  }

  // Update Payment
  await DB.Payment.updateOne({ _id: _id }, {
    money: realMoney,
    status: realStatus,
    verify: {
      person: verify_person,
      time: time,
      reason: realReason
    }
  })
}