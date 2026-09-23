import type {
  IDBLimitedHalloween,
  IDBLimitedChristmas,
  IDBLimitedMonster,
  IDBLimitedLootChest,
  IDBLimitedPay,
  IDBLimitedLunar
} from "~~/types"

// helper: check time window
const isActiveEvent = (config: any) => {
  if (!config) return false
  if (!config.time?.active) return false
  if (!config.time?.start || !config.time?.end) return false
  return true
}

// helper: convert mongoose doc -> plain object nhanh hơn stringify
const toPlain = (doc: any) => (doc?.toObject ? doc.toObject() : doc)

export default defineEventHandler(async (event) => {
  const runtimeConfig = useRuntimeConfig()
  const REDIS_KEY = `${runtimeConfig.redisPREFIX || "default"}:event:limited`
  const REDIS_TTL = 24 * 60 * 60

  // 1) Redis first
  if (DBRedis) {
    const cached = await DBRedis.get(REDIS_KEY)
    if (cached) return resp(event, { result: JSON.parse(cached) })
  }

  // 2) Tính thời gian chung 1 lần
  const nowDate = new Date()
  const nowUnix = dayjs().unix()

  const tasks = {
    shop: (async () => {
      const list = await DB.LimitedShop.find({
        "time.start": { $lte: nowDate },
        "time.end": { $gte: nowDate },
        $or: [{ limit: 0 }, { $expr: { $lt: ["$buyed", "$limit"] } }],
        gift: { $exists: true, $not: { $size: 0 } }
      })
        .populate({ path: "gift.item", select: "item_id item_name item_image type" })
        .sort({ "time.start": 1 })
        .lean()

      return list.length ? list : null
    })(),

    pay: (async () => {
      const config = (await DB.LimitedPay.findOne({})
        .populate({ path: "reward.gift.item", select: "item_id item_name item_image type" })) as IDBLimitedPay

      if (!isActiveEvent(config)) return null

      const start = dayjs(config.time.start).unix()
      const end = dayjs(config.time.end).unix()
      if (nowUnix < start || nowUnix > end) return null

      return toPlain(config)
    })(),

    halloween: (async () => {
      const config = (await DB.LimitedHalloween.findOne({})
        .populate({ path: "jar.reward.item", select: "item_id item_name item_image type" })
        .populate({ path: "pumpkin.reward.item", select: "item_id item_name item_image type" })
        .populate({ path: "top.reward.gift.item", select: "item_id item_name item_image type" })) as IDBLimitedHalloween

      if (!isActiveEvent(config)) return null

      const start = dayjs(config.time.start).unix()
      const end = dayjs(config.time.end).unix()
      const reward = dayjs(config.time.end).add(1, "day").unix()

      if (nowUnix < start || nowUnix > reward) return null

      const result: any = toPlain(config)
      if (nowUnix >= end && nowUnix < reward) result.rewardTime = dayjs(config.time.end).add(1, "day").toDate()
      return result
    })(),

    christmas: (async () => {
      const config = (await DB.LimitedChristmas.findOne({})
        .populate({ path: "jar.reward.gift.item", select: "item_id item_name item_image type" })
        .populate({ path: "box.reward.gift.item", select: "item_id item_name item_image type" })
        .populate({ path: "box.random.item", select: "item_id item_name item_image type" })
        .populate({ path: "top.reward.gift.item", select: "item_id item_name item_image type" })) as IDBLimitedChristmas

      if (!isActiveEvent(config)) return null

      const start = dayjs(config.time.start).unix()
      const end = dayjs(config.time.end).unix()
      const reward = dayjs(config.time.end).add(1, "day").unix()

      if (nowUnix < start || nowUnix > reward) return null

      const result: any = toPlain(config)
      if (nowUnix >= end && nowUnix < reward) result.rewardTime = dayjs(config.time.end).add(1, "day").toDate()
      return result
    })(),

    monster: (async () => {
      const config = (await DB.LimitedMonster.findOne({})
        .populate({ path: "blood.reward.gift.item", select: "item_id item_name item_image type" })
        .populate({ path: "lasthit.user", select: "username" })
        .populate({ path: "lasthit.reward.item", select: "item_id item_name item_image type" })
        .populate({ path: "top.reward.gift.item", select: "item_id item_name item_image type" })) as IDBLimitedMonster

      if (!isActiveEvent(config)) return null

      const start = dayjs(config.time.start).unix()
      const end = dayjs(config.time.end).unix()
      const reward = dayjs(config.time.end).add(1, "day").unix()

      if (nowUnix < start || nowUnix > reward) return null

      const result: any = toPlain(config)
      if (nowUnix >= end && nowUnix < reward) result.rewardTime = dayjs(config.time.end).add(1, "day").toDate()
      return result
    })(),

    lootchest: (async () => {
      const config = (await DB.LimitedLootChest.findOne({})
        .populate({ path: "owner", select: "username" })
        .populate({ path: "reward.item", select: "item_id item_name item_image type" })) as IDBLimitedLootChest

      if (!isActiveEvent(config)) return null

      const start = dayjs(config.time.start).unix()
      const end = dayjs(config.time.end).unix()
      const reward = dayjs(config.time.end).add(1, "day").unix()

      if (nowUnix < start || nowUnix > reward) return null

      const result: any = toPlain(config)
      if (nowUnix >= end && nowUnix < reward) result.rewardTime = dayjs(config.time.end).add(1, "day").toDate()
      return result
    })(),

    lunar: (async () => {
      const config = (await DB.LimitedLunar.findOne({})
        .populate({ path: "jar.reward.gift.item", select: "item_id item_name item_image type" })
        .populate({ path: 'eve.gift.item', select: 'item_id item_name item_image type' })
        .populate({ path: "redbag.reward.gift.item", select: "item_id item_name item_image type" })
        .populate({ path: "redbag.random.item", select: "item_id item_name item_image type" })
        .populate({ path: "top.reward.gift.item", select: "item_id item_name item_image type" })
        .populate({ path: "piece.reward.gift.item", select: "item_id item_name item_image type" })) as IDBLimitedLunar

      if (!isActiveEvent(config)) return null

      const start = dayjs(config.time.start).unix()
      const end = dayjs(config.time.end).unix()
      const reward = dayjs(config.time.end).add(1, "day").unix()

      if (nowUnix < start || nowUnix > reward) return null

      const result: any = toPlain(config)
      if (nowUnix >= end && nowUnix < reward) result.rewardTime = dayjs(config.time.end).add(1, "day").toDate()
      return result
    })()
  }

  // 3) Chạy song song, không fail cả API nếu 1 event lỗi
  const entries = await Promise.allSettled(Object.entries(tasks).map(async ([k, p]) => [k, await p] as const))

  // 4) Thiết lập dữ liệu
  const limited: any = {
    shop: null,
    pay: null,
    halloween: null,
    christmas: null,
    monster: null,
    lootchest: null,
    lunar: null
  }

  for (const item of entries) {
    if (item.status === "fulfilled") {
      const [k, v] = item.value
      limited[k] = v ?? null
    }
  }
  
  // 5) Lưu Cache và xuất
  DBRedis && (await DBRedis.set(REDIS_KEY, JSON.stringify(limited), "EX", REDIS_TTL))
  return resp(event, { result: limited })
})
