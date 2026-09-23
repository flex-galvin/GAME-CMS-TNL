import type { IAuth, IDBItem, IDBNews, IDBShopPack } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'config.action')

    await Promise.all([
      // Game
      DB.GameRankPowerUp.deleteMany({}),
      DB.GameRankPowerUpProcessLog.deleteMany({}),
      DB.GameRankProcessLog.deleteMany({}),
      DB.GameMissionHistory.deleteMany({}),

      // Limited Christmas
      DB.LimitedChristmas.updateMany({}, {
        $set: {
          'time.active': false,
          'time.start': null,
          'time.end': null,
          'jar.now': 0
        }
      }),
      DB.LimitedChristmasUser.deleteMany({}),
      DB.LimitedChristmasJarHistory.deleteMany({}),
      DB.LimitedChristmasTopHistory.deleteMany({}),
      DB.LimitedChristmasBoxHistory.deleteMany({}),
      DB.LimitedChristmasBoxStepHistory.deleteMany({}),

      // Limited Halloween
      DB.LimitedHalloween.updateMany({}, {
        $set: {
          'time.active': false,
          'time.start': null,
          'time.end': null,
          'jar.now': 0
        }
      }),
      DB.LimitedHalloweenUser.deleteMany({}),
      DB.LimitedHalloweenJarHistory.deleteMany({}),
      DB.LimitedHalloweenTopHistory.deleteMany({}),
      DB.LimitedHalloweenPumpkinHistory.deleteMany({}),

      // Limited Lunar
      DB.LimitedLunar.updateMany({}, {
        $set: {
          'time.active': false,
          'time.start': null,
          'time.end': null,
          'jar.now': 0
        }
      }),
      DB.LimitedLunarUser.deleteMany({}),
      DB.LimitedLunarJarHistory.deleteMany({}),
      DB.LimitedLunarTopHistory.deleteMany({}),
      DB.LimitedLunarRedbagHistory.deleteMany({}),
      DB.LimitedLunarRedbagStepHistory.deleteMany({}),
      DB.LimitedLunarPieceHistory.deleteMany({}),
      DB.LimitedLunarPieceRewardHistory.deleteMany({}),

      // Limited Lootchest
      DB.LimitedLootChest.updateMany({}, {
        $set: {
          'time.active': false,
          'time.start': null,
          'time.end': null,
          'owner': null,
          'receive.status': false,
          'receive.role': null,
          'receive.server': null,
          'money.now': 0,
        }
      }),

      // Limited Monster
      DB.LimitedMonster.updateMany({}, {
        $set: {
          'time.active': false,
          'time.start': null,
          'time.end': null,
          'lasthit.user': null,
          'lasthit.receive.status': false,
          'lasthit.receive.server': null,
          'lasthit.receive.role': null,
        }
      }),
      DB.LimitedMonsterUser.deleteMany({}),
      DB.LimitedMonsterBloodHistory.deleteMany({}),
      DB.LimitedMonsterTopHistory.deleteMany({}),

      // Limited Pay
      DB.LimitedPay.updateMany({}, {
        $set: {
          'time.active': false,
          'time.start': null,
          'time.end': null,
        }
      }),
      DB.LimitedPayUser.deleteMany({}),
      DB.LimitedPayHistory.deleteMany({}),

      // Limited Shop
      DB.LimitedShop.updateMany({}, {
        $set: {
          'time.start': null,
          'time.end': null,
          'buyed': 0
        }
      }),
      DB.LimitedShopHistory.deleteMany({}),

      // Minigame Egg
      DB.EggUser.deleteMany({}),
      DB.EggHistory.deleteMany({}),

      // Minigame Wheel
      DB.WheelHistory.deleteMany({}),

      // Event
      DB.EventHistory.deleteMany({}),

      // Giftcode
      DB.GiftcodeHistory.deleteMany({}),

      // Log
      DB.LogAdminSendItem.deleteMany({}),
      DB.LogCron.deleteMany({}),

      // Payment
      DB.Payment.deleteMany({ status: 0 }),
      DB.Payment.deleteMany({ status: 2 }),
      DB.Payment.updateMany({ status: 1 }, { status: 0 }),

      // Shop
      DB.ShopHistory.deleteMany({}),
      DB.ShopPackHistory.deleteMany({}),

      // Socket
      DB.SocketChat.deleteMany({}),
      DB.SocketOnline.deleteMany({}),

      // User
      DB.UserLogin.deleteMany({}),
      DB.User.updateMany({}, {
        $set: {
          'vip.enable': false,
          'vip.type': null,
          'vip.end': null,
          'vip.gift': false,
          'currency.coin': 0,
          'currency.wheel': 0,
          'currency.diamond': 0,
          'paymusty': [],
          'paydays.day': 0,
          'paydays.receive': 0,
          'pay.total.money': 0,
          'pay.day.money': 0,
          'pay.month.money': 0,
          'spend.total.coin': 0,
          'spend.day.coin': 0,
          'spend.month.coin': 0,
          'login.month': 1,
          'login.total': 1,
          'login.update': null,
        }
      })
    ])

    await logAdmin(event, 'Thao tác <b>Reopen</b>')
    !!IO && IO.emit('notice-reload', 'Có bản cập nhật mới, vui lòng tải lại trang !')

    // Clear Cache
    const REDIS_PREFIX = runtimeConfig.redisPREFIX || 'default'
    if(DBRedis) await Promise.allSettled([
      DBRedis.del(`${REDIS_PREFIX}:config:public`),
      DBRedis.del(`${REDIS_PREFIX}:config:promo`),
      DBRedis.del(`${REDIS_PREFIX}:config:home`),
    ])

    return resp(event, { message: 'Thực hiện thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})