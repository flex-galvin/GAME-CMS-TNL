import type { IAuth } from "~~/types"
import excelJS from 'exceljs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'user.export')

    const workbook = new excelJS.Workbook()
    const worksheet = workbook.addWorksheet('Users')

    worksheet.columns = [ 
      { header: "Username", key: "username", width: 15 }, 
      { header: "Phone", key: "phone", width: 15 }, 
      { header: "Email", key: "email", width: 25 },
      { header: "Payment", key: "payment", width: 15 },
    ]

    const users = await DB.User.aggregate([
      {
        $lookup: {
          from: "Payment",
          localField: "_id",
          foreignField: "user",
          pipeline: [
            { $match: { status: 1 } },
            { $project: { money: 1 } }
          ],
          as: "payments"
        }
      },
      { $project: {
        username: 1, phone: 1, email: 1,
        payment: { $sum: '$payments.money' }
      }},
      { $sort: { payment: -1 }}
    ])

    users.forEach(user => { 
      user.payment = user.payment.toLocaleString('vi-VN')
      worksheet.addRow(user) 
    })
    const createdAt = formatDate(new Date())
    const filename = `excel-users-${createdAt.day}${createdAt.month}${createdAt.year}-${createdAt.hour}-${createdAt.minute}-${createdAt.timestamp}.xlsx`
    const filePath = join('dist/excel', filename)
    await workbook.xlsx.writeFile(filePath) as any

    return resp(event, { result: `/excel/${filename}` })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})