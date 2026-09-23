import type { IAuth, IDBUser } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'user.del')

    throw 'Tính năng bảo trì'

    const { day, limit } = await readBody(event)
    if(!!isNaN(parseInt(day)) || parseInt(day) < 30) throw 'Dữ liệu đầu vào không hợp lệ'

    const now = dayjs()
    const startNow = now.startOf('day')
    const dateDel = startNow.subtract(day, 'day')
    const max = limit || 500

    const list = await DB.User
    .aggregate([
      { $match: { 
        'login.update': { $lte: dateDel.toDate() },
        'pay.total.money': { $gt: 0 },
        'type': { $eq: 0 }
      }},
      {
        $lookup: {
          from: "Payment",
          localField: "_id",
          foreignField: "user",
          pipeline: [{
            $project: {
              money: { $cond: [{$eq: ['$status', 1]} , '$money', 0] },
            }
          }],
          as: "payments"
        }
      },
      { $addFields: { totalMoney: { $sum: '$payments.money' }}},
      { $match: { totalMoney: { $lt: 1 } }},
      { $sort: { createdAt: 1 }},
      { $limit: max },
      { $project: { _id: 1 }}
    ])
    if(list.length == 0) throw 'Không có tài khoản nào thỏa mãn để xóa'

    const bot = await DB.User.findOne({ username: 'bot' }).select('_id') as IDBUser
    if (!bot) throw 'Không tìm thấy tài khoản Bot'

    const users = list.map((user) => user._id)

    const deletePromises = [
      DB.WheelHistory.deleteMany({ user: { $in: users } }),
      DB.EggUser.deleteMany({ user: { $in: users } }),
      DB.EggHistory.deleteMany({ user: { $in: users } }),
      DB.ShopHistory.deleteMany({ user: { $in: users } }),
      DB.ShopPackHistory.deleteMany({ user: { $in: users } }),
      DB.EventHistory.deleteMany({ user: { $in: users } }),
      DB.GiftcodeHistory.deleteMany({ user: { $in: users } }),
      DB.LogUser.deleteMany({ user: { $in: users } }),
      DB.LogUserIP.deleteMany({ user: { $in: users } }),
      DB.SocketChat.deleteMany({ user: { $in: users } }),
      DB.SocketOnline.deleteMany({ user: { $in: users } }),
      DB.UserLogin.deleteMany({ user: { $in: users } }),
      DB.Payment.deleteMany({ user: { $in: users } }),
      DB.LogAdminSendItem.deleteMany({ from: { $in: users } }),
      DB.LogAdminSendItem.deleteMany({ to: { $in: users } }),
      DB.LogAdmin.deleteMany({ user: { $in: users } })
    ]
    await Promise.allSettled(deletePromises)

    const bulkOps = users.flatMap((_id) => ([
      { updateMany: { filter: { 'referral.person': _id }, update: { 'referral.person': null } } }, // User
      { updateMany: { filter: { 'user': _id }, update: { 'user': bot._id } } },                    // Spend or Payment
      { updateMany: { filter: { 'verify.person': _id }, update: { 'verify.person': bot._id } } },  // Payment
      { updateMany: { filter: { 'creator': _id }, update: { 'creator': bot._id } } },              // News
      { updateMany: { filter: { 'updater': _id }, update: { 'updater': bot._id } } },              // News
    ]))

    await Promise.allSettled([
      DB.User.bulkWrite(bulkOps),
      DB.Spend.bulkWrite(bulkOps),
      DB.Payment.bulkWrite(bulkOps),
      DB.News.bulkWrite(bulkOps),
    ])
    
    await DB.User.deleteMany({ _id: { $in: users } })

    await logAdmin(event, `Xóa ${max} tài khoản chưa <b>đăng nhập</b> trong ${day} ngày`)
    return resp(event, { message: 'Sửa dữ liệu đăng nhập thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})