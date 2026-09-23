import type { IAuth } from "~~/types"
import excelJS from 'exceljs'
import { join } from 'path'
import { writeFileSync } from 'fs'

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'item.export')

    const { type } = await readBody(event)
    if(!type) throw 'Không tìm thấy kiểu xuất'

    if(type == 'excel'){
      const workbook = new excelJS.Workbook()
      const worksheet = workbook.addWorksheet('Items')

      worksheet.columns = [ 
        { header: "ID", key: "item_id", width: 10 }, 
        { header: "Name", key: "item_name", width: 30 }, 
      ]

      const items = await DB.Item.find({ type: 'game_item' }).select('item_id item_name')
      items.forEach(item => { worksheet.addRow(item) })

      const createdAt = formatDate(new Date())
      const filename = `excel-items-${createdAt.day}${createdAt.month}${createdAt.year}-${createdAt.hour}-${createdAt.minute}-${createdAt.timestamp}.xlsx`
      const filePath = join('dist/excel', filename)
      await workbook.xlsx.writeFile(filePath) as any

      return resp(event, { result: `/excel/${filename}` })
    }

    if(type == 'json'){
      const items = await DB.Item.find({ type: 'game_item' }).select('item_id item_name item_image type -_id')
      const createdAt = formatDate(new Date())
      const filename = `json-items-${createdAt.day}${createdAt.month}${createdAt.year}-${createdAt.hour}-${createdAt.minute}-${createdAt.timestamp}.json`
      const filePath = join('dist/upload', filename)
      writeFileSync(filePath, JSON.stringify(items, null, 2))

      return resp(event, { result: `/upload/${filename}` })
    }
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})