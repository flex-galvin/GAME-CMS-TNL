import { createError, sendStream } from 'h3'
import { createReadStream, existsSync } from 'fs'
import { resolve } from 'path'

export default defineEventHandler(async (event) => {
  // @ts-expect-error
  const fileName = decodeURIComponent(event.context.params.name || '')

  if (!fileName) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Không thấy tên tài nguyên'
    })
  }

  const baseDir = resolve(process.cwd(), 'dist/excel')
  const filePath = resolve(baseDir, fileName)
  if (!filePath.startsWith(baseDir)) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Quyền truy cập trái phép'
    })
  }
  if (!existsSync(filePath)) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Tài nguyên không tồn tại'
    })
  }

  setHeader(event, 'Content-Disposition', `attachment; filename="${fileName}"`)
  return sendStream(event, createReadStream(filePath))
})