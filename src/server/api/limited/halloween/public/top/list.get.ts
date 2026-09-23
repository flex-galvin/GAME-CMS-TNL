import type { IDBLimitedHalloween } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const config = await DB.LimitedHalloween.findOne().select('top') as IDBLimitedHalloween
    if(!config) throw 'Không tìm thấy cấu hình sự kiện'

    const list = await DB.LimitedHalloweenUser.aggregate([
      { $match: { point: { $gte: config.top.need || 1 } } },
      { $sort: { point: -1, createdAt: 1 } },
      { $limit: config.top.max },
      {
        $lookup: {
          from: "User",
          localField: "user",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      { $unwind: "$userInfo" },
      {
        $project: {
          _id: '$userInfo._id',
          username: '$userInfo.username',
          point: 1
        }
      }
    ])

    list.map((item, index) => {
      const name = String(item.username ?? "")
      item.username = name.length > 3 ? name.slice(0, -3) + '***' : '***'
      item.rank = index + 1
    })
    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { result: [] })
  }
})