import type { IGlobalDB } from '~~/types'
import { createError } from 'h3'
import mongoose from 'mongoose';
import Model from '../model'

declare global {
  var DB : IGlobalDB
}

export default defineNitroPlugin(async (nitroApp) => {
  const runtimeConfig = useRuntimeConfig()
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(runtimeConfig.mongoURI, { 
      dbName: runtimeConfig.mongoDB 
    })
    .then(async () => {
      console.log('[MongoDB] ✅ Kết nối thành công')
      global.DB = Model(mongoose)
    })
    .catch(e => {
      throw createError({ 
        statusCode: 500, 
        message: `[MongoDB] ❌ Lỗi kết nối: ${e.toString()}` 
      })
    })
  }
})