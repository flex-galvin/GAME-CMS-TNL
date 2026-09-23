import multer from 'multer'
import md5 from 'md5'
import { IAuth } from '~~/types'

const uploadImage = multer({ 
  storage: multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, './dist/upload')
    },
    filename: function(req, file, cb) {
      const hash = md5(file.originalname + '-' + Date.now())
      const type = file.originalname.split('.')[file.originalname.split('.').length -1]
      const name = `image-${hash}.${type}`
      cb(null, name)
    },
  }),

  limits: {
    fileSize: 10 * 1024 * 1024
  },

  fileFilter: (req, file, cb) => {
    const acceptedTypes = file.mimetype.split('/')
    if(acceptedTypes[0] === 'image') cb(null, true)
    else cb(new Error('Chỉ hỗ trợ file hình ảnh'))
  }
})

export default defineEventHandler(async (event) => {
  try{
    const auth = await getAuth(event) as IAuth
    if(auth.type < 1) throw 'Tính năng đang không dành cho khánh hàng'

    // @ts-expect-error
    await callNodeListener(uploadImage.single('image'), event.node.req, event.node.res)
    // @ts-expect-error
    const file = event.node.req.file
    const url = `/upload/${file.filename}`
    return resp(event, { message: 'Tải hình ảnh thành công', result: url })
  } 
  catch (e:any) {
    return resp(event, { result: false })
  }
})