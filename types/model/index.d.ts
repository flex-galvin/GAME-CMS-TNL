import type { Model } from 'mongoose'
export { IDBConfig, IDBConfigStore } from './config'
export { IDBNews, IDBNewsCategory } from './news'
export { IDBUser, IDBUserLogin, IDBUserStore, IDBLevel } from './user'
export { IDBGate } from './gate'
export { IDBPaymentConfig, IDBPayment } from './payment'
export { IDBSpend } from './spend'
export { IDBShopConfig, IDBShopCategory, IDBShop, IDBShopHistory, IDBShopPack, IDBShopPackHistory } from './shop'
export { IDBEventConfig, IDBEvent, IDBEventHistory } from './event'
export { IDBGiftcode, IDBGiftcodeHistory } from './giftcode'
export { 
  IDBWheel, IDBWheelHistory,
  IDBEgg, IDBEggUser, IDBEggHistory
} from './minigame'
export { 
  IDBLimitedShop, IDBLimitedShopHistory,
  IDBLimitedHalloween, IDBLimitedHalloweenUser, IDBLimitedHalloweenJarHistory, IDBLimitedHalloweenPumpkinHistory, IDBLimitedHalloweenTopHistory,
  IDBLimitedChristmas, IDBLimitedChristmasUser, IDBLimitedChristmasJarHistory, IDBLimitedChristmasTopHistory, IDBLimitedChristmasBoxHistory, IDBLimitedChristmasBoxStepHistory,
  IDBLimitedMonster, IDBLimitedMonsterUser, IDBLimitedMonsterBloodHistory, IDBLimitedMonsterTopHistory,
  IDBLimitedLootChest,
  IDBLimitedPay, IDBLimitedPayHistory, IDBLimitedPayUser,
  IDBLimitedLunar, IDBLimitedLunarUser, IDBLimitedLunarJarHistory, IDBLimitedLunarTopHistory, IDBLimitedLunarRedbagHistory, IDBLimitedLunarRedbagStepHistory, IDBLimitedLunarPieceHistory, IDBLimitedLunarPieceRewardHistory
} from './limited'
export { 
  IDBItem, IDBItemBox,
  IDBGameRankPowerUpProcess, IDBGameRankPowerUpProcessLog, IDBGameRankPowerUp,
  IDBGameRankProcess, IDBGameRankProcessLog,
  IDBGameMission, IDBGameMissionHistory
} from './game'
export { 
  IDBLogAdmin, IDBLogAdminSendItem, 
  IDBLogUser, IDBLogUserIP, 
  IDBLogBlockIP,
  IDBLogCron
} from './log'
export { IDBAdsLanding, IDBAdsFrom } from './ads'
export { IDBAdminIP } from './ip'
export { IDBSocketOnline, IDBSocketChat } from './socket'

export interface IGlobalDB {
  Config: Model<IDBConfig>

  News: Model<IDBNews>
  NewsCategory: Model<IDBNewsCategory>

  User: Model<IDBUser>
  UserLogin: Model<IDBUserLogin>
  Level: Model<IDBLevel>

  Gate: Model<IDBGate>

  PaymentConfig: Model<IDBPaymentConfig>
  Payment: Model<IDBPayment>

  Spend: Model<IDBSpend>

  Item: Model<IDBItem>
  ItemBox: Model<IDBItemBox>

  ShopConfig: Model<IDBShopConfig>
  ShopCategory: Model<IDBShopCategory>
  Shop: Model<IDBShop>
  ShopHistory: Model<IDBShopHistory>
  ShopPack: Model<IDBShopPack>
  ShopPackHistory: Model<IDBShopPackHistory>
 
  EventConfig: Model<IDBEventConfig>
  Event: Model<IDBEvent>
  EventHistory: Model<IDBEventHistory>

  Giftcode: Model<IDBGiftcode>
  GiftcodeHistory: Model<IDBGiftcodeHistory>

  Wheel: Model<IDBWheel>
  WheelHistory: Model<IDBWheelHistory>

  Egg: Model<IDBEgg>
  EggUser: Model<IDBEggUser>
  EggHistory: Model<IDBEggHistory>

  LimitedShop: Model<IDBLimitedShop>
  LimitedShopHistory: Model<IDBLimitedShopHistory>

  LimitedHalloween: Model<IDBLimitedHalloween>
  LimitedHalloweenUser: Model<IDBLimitedHalloweenUser>
  LimitedHalloweenJarHistory: Model<IDBLimitedHalloweenJarHistory>
  LimitedHalloweenPumpkinHistory: Model<IDBLimitedHalloweenPumpkinHistory>
  LimitedHalloweenTopHistory: Model<IDBLimitedHalloweenTopHistory>

  LimitedChristmas: Model<IDBLimitedChristmas>
  LimitedChristmasUser: Model<IDBLimitedChristmasUser>
  LimitedChristmasJarHistory: Model<IDBLimitedChristmasJarHistory>
  LimitedChristmasTopHistory: Model<IDBLimitedChristmasTopHistory>
  LimitedChristmasBoxHistory: Model<IDBLimitedChristmasBoxHistory>
  LimitedChristmasBoxStepHistory: Model<IDBLimitedChristmasBoxStepHistory>

  LimitedMonster: Model<IDBLimitedMonster>
  LimitedMonsterUser: Model<IDBLimitedMonsterUser>
  LimitedMonsterBloodHistory: Model<IDBLimitedMonsterBloodHistory>
  LimitedMonsterTopHistory: Model<IDBLimitedMonsterTopHistory>

  LimitedLootChest: Model<IDBLimitedLootChest>

  LimitedPay: Model<IDBLimitedPay>
  LimitedPayUser: Model<IDBLimitedPayUser>
  LimitedPayHistory: Model<IDBLimitedPayHistory>

  LimitedLunar: Model<IDBLimitedLunar>
  LimitedLunarUser: Model<IDBLimitedLunarUser>
  LimitedLunarJarHistory: Model<IDBLimitedLunarJarHistory>
  LimitedLunarTopHistory: Model<IDBLimitedLunarTopHistory>
  LimitedLunarRedbagHistory: Model<IDBLimitedLunarRedbagHistory>
  LimitedLunarRedbagStepHistory: Model<IDBLimitedLunarRedbagStepHistory>
  LimitedLunarPieceHistory: Model<IDBLimitedLunarPieceHistory>
  LimitedLunarPieceRewardHistory: Model<IDBLimitedLunarPieceRewardHistory>

  GameRankProcess: Model<IDBGameRankProcess>
  GameRankProcessLog: Model<IDBGameRankProcessLog>
  GameRankPowerUpProcess: Model<IDBGameRankPowerUpProcess>
  GameRankPowerUpProcessLog: Model<IDBGameRankPowerUpProcessLog>
  GameRankPowerUp: Model<IDBGameRankPowerUp>
  GameMission: Model<IDBGameMission>
  GameMissionHistory: Model<IDBGameMissionHistory>

  LogAdmin: Model<IDBLogAdmin>
  LogAdminSendItem: Model<IDBLogAdminSendItem>

  LogBlockIP: Model<IDBLogBlockIP>
  LogUser: Model<IDBLogUser>
  LogUserIP: Model<IDBLogUserIP>
  LogCron: Model<IDBLogCron>

  SocketOnline: Model<IDBSocketOnline>
  SocketChat: Model<IDBSocketChat>

  AdsLanding: Model<IDBAdsLanding>
  AdsFrom: Model<IDBAdsFrom>

  AdminIP: Model<IDBAdminIP>
}