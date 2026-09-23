import type { IGlobalDB } from '~~/types'
import type { Mongoose } from 'mongoose'
import { DBConfig } from './config'
import { DBNews, DBNewsCategory } from './news'
import { DBUser, DBUserLogin, DBLevel } from './user'
import { DBGate } from './gate'
import { DBPaymentConfig, DBPayment } from './payment'
import { DBSpend } from './spend'
import { DBShopConfig, DBShop, DBShopHistory, DBShopPack, DBShopPackHistory, DBShopCategory } from './shop'
import { DBEvent, DBEventConfig, DBEventHistory } from './event'
import { DBGiftcode, DBGiftcodeHistory } from './giftcode'
import { 
  DBEgg, DBEggHistory, DBEggUser, 
  DBWheel, DBWheelHistory } from './minigame'
import { 
  DBLimitedShop, DBLimitedShopHistory,
  DBLimitedHalloween, DBLimitedHalloweenUser, DBLimitedHalloweenJarHistory, DBLimitedHalloweenPumpkinHistory, DBLimitedHalloweenTopHistory,
  DBLimitedChristmas, DBLimitedChristmasUser, DBLimitedChristmasJarHistory, DBLimitedChristmasTopHistory, DBLimitedChristmasBoxHistory, DBLimitedChristmasBoxStepHistory,
  DBLimitedMonster, DBLimitedMonsterUser, DBLimitedMonsterBloodHistory, DBLimitedMonsterTopHistory,
  DBLimitedLootChest,
  DBLimitedPay, DBLimitedPayUser, DBLimitedPayHistory,
  DBLimitedLunar, DBLimitedLunarUser, DBLimitedLunarJarHistory, DBLimitedLunarTopHistory, DBLimitedLunarRedbagHistory, DBLimitedLunarRedbagStepHistory, DBLimitedLunarPieceHistory, DBLimitedLunarPieceRewardHistory,
} from './limited'
import { 
  DBItem, DBItemBox,
  DBGameRankProcess, DBGameRankProcessLog,
  DBGameRankPowerUpProcess, DBGameRankPowerUpProcessLog, DBGameRankPowerUp, 
  DBGameMission, DBGameMissionHistory
} from './game'
import { 
  DBLogAdmin, DBLogAdminSendItem, 
  DBLogUser, DBLogUserIP, 
  DBLogBlockIP,
  DBLogCron
} from './log'
import { DBAdsFrom, DBAdsLanding } from './ads'
import { DBAdminIP } from './ip'
import { DBSocketChat, DBSocketOnline } from './socket'

export default (mongoose : Mongoose) : IGlobalDB => {
  return {
    Config: DBConfig(mongoose),
    
    NewsCategory: DBNewsCategory(mongoose),
    News: DBNews(mongoose),

    User: DBUser(mongoose),
    UserLogin: DBUserLogin(mongoose),
    Level: DBLevel(mongoose),

    Gate: DBGate(mongoose),

    PaymentConfig: DBPaymentConfig(mongoose),
    Payment: DBPayment(mongoose),

    Spend: DBSpend(mongoose),
    
    Item: DBItem(mongoose),
    ItemBox: DBItemBox(mongoose),
    
    ShopConfig: DBShopConfig(mongoose),
    ShopCategory: DBShopCategory(mongoose),
    Shop: DBShop(mongoose),
    ShopHistory: DBShopHistory(mongoose),
    ShopPack: DBShopPack(mongoose),
    ShopPackHistory: DBShopPackHistory(mongoose),

    EventConfig: DBEventConfig(mongoose),
    Event: DBEvent(mongoose),
    EventHistory: DBEventHistory(mongoose),

    Giftcode: DBGiftcode(mongoose),
    GiftcodeHistory: DBGiftcodeHistory(mongoose),

    Wheel: DBWheel(mongoose),
    WheelHistory: DBWheelHistory(mongoose),

    Egg: DBEgg(mongoose),
    EggUser: DBEggUser(mongoose),
    EggHistory: DBEggHistory(mongoose),

    LimitedShop: DBLimitedShop(mongoose),
    LimitedShopHistory: DBLimitedShopHistory(mongoose),

    LimitedHalloween: DBLimitedHalloween(mongoose),
    LimitedHalloweenUser: DBLimitedHalloweenUser(mongoose),
    LimitedHalloweenJarHistory: DBLimitedHalloweenJarHistory(mongoose),
    LimitedHalloweenPumpkinHistory: DBLimitedHalloweenPumpkinHistory(mongoose),
    LimitedHalloweenTopHistory: DBLimitedHalloweenTopHistory(mongoose),

    LimitedChristmas: DBLimitedChristmas(mongoose),
    LimitedChristmasUser: DBLimitedChristmasUser(mongoose),
    LimitedChristmasJarHistory: DBLimitedChristmasJarHistory(mongoose),
    LimitedChristmasTopHistory: DBLimitedChristmasTopHistory(mongoose),
    LimitedChristmasBoxHistory: DBLimitedChristmasBoxHistory(mongoose),
    LimitedChristmasBoxStepHistory: DBLimitedChristmasBoxStepHistory(mongoose),

    LimitedMonster: DBLimitedMonster(mongoose),
    LimitedMonsterUser: DBLimitedMonsterUser(mongoose),
    LimitedMonsterBloodHistory: DBLimitedMonsterBloodHistory(mongoose),
    LimitedMonsterTopHistory: DBLimitedMonsterTopHistory(mongoose),

    LimitedLootChest: DBLimitedLootChest(mongoose),

    LimitedPay: DBLimitedPay(mongoose),
    LimitedPayUser: DBLimitedPayUser(mongoose),
    LimitedPayHistory: DBLimitedPayHistory(mongoose),

    LimitedLunar: DBLimitedLunar(mongoose),
    LimitedLunarUser: DBLimitedLunarUser(mongoose),
    LimitedLunarJarHistory: DBLimitedLunarJarHistory(mongoose),
    LimitedLunarTopHistory: DBLimitedLunarTopHistory(mongoose),
    LimitedLunarRedbagHistory: DBLimitedLunarRedbagHistory(mongoose),
    LimitedLunarRedbagStepHistory: DBLimitedLunarRedbagStepHistory(mongoose),
    LimitedLunarPieceHistory: DBLimitedLunarPieceHistory(mongoose),
    LimitedLunarPieceRewardHistory: DBLimitedLunarPieceRewardHistory(mongoose),

    GameRankProcess: DBGameRankProcess(mongoose),
    GameRankProcessLog: DBGameRankProcessLog(mongoose),
    GameRankPowerUpProcess: DBGameRankPowerUpProcess(mongoose),
    GameRankPowerUpProcessLog: DBGameRankPowerUpProcessLog(mongoose),
    GameRankPowerUp: DBGameRankPowerUp(mongoose),
    GameMission: DBGameMission(mongoose),
    GameMissionHistory: DBGameMissionHistory(mongoose),

    LogAdmin: DBLogAdmin(mongoose),
    LogAdminSendItem: DBLogAdminSendItem(mongoose),

    LogBlockIP: DBLogBlockIP(mongoose),
    LogUser: DBLogUser(mongoose),
    LogUserIP: DBLogUserIP(mongoose),
    LogCron: DBLogCron(mongoose),

    AdsLanding: DBAdsLanding(mongoose),
    AdsFrom: DBAdsFrom(mongoose),

    SocketOnline: DBSocketOnline(mongoose),
    SocketChat: DBSocketChat(mongoose),

    AdminIP: DBAdminIP(mongoose)
  }
}