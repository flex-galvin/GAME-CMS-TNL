import type { IAuth, IDBEgg } from "~~/types"

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'egg.update')

    const data = await readBody(event)
    const { one, two, three, four, five, six } = data
    if(!one || !two || !three || !four || !five || !six) throw 'Dữ liệu đầu vào không hợp lệ'

    if(
      !!isNaN(parseInt(one.price)) || parseInt(one.price) < 0
      || !!isNaN(parseInt(two.price)) || parseInt(two.price) < 0
      || !!isNaN(parseInt(three.price)) || parseInt(three.price) < 0
      || !!isNaN(parseInt(four.price)) || parseInt(four.price) < 0
      || !!isNaN(parseInt(five.price)) || parseInt(five.price) < 0
      || !!isNaN(parseInt(six.price)) || parseInt(six.price) < 0
    ) throw 'Dữ liệu đầu vào sai'
    
    const config = await DB.Egg.findOne({}) as IDBEgg
    if(!config) throw 'Không tìm thấy cấu hình'

    const row = ['one', 'two', 'three', 'four', 'five', 'six']
    row.forEach(name => {
      // @ts-expect-error
      config[`${name}`] = {
        price: data[`${name}`].price,
        gift:  data[`${name}`].gift.map(({ item, amount, percent } : any) => ({ item: item._id, amount, percent }))
      }
    })

    // @ts-expect-error
    await config.save()

    await logAdmin(event, `Sửa cấu hình <b>Đập Trứng</b>`)
    return resp(event, { message: 'Cập nhật thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})