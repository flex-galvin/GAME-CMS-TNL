import type { IDBUser, IAuth, IDBEgg, IDBConfig } from "~~/types"

const rowFormatNumber = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 }
const numberFormatRow = { 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six' }
const currencyTypeList = [ 'coin', 'wheel' ]

const getRandomGift = (list : Array<any>) : any => {
  // Get Random
  let totalPercent = 0
  let rand = 0

  totalPercent = list.reduce((accumulator, object) => {
    return parseFloat(String(accumulator)) + parseFloat(String(object.percent))
  }, 0)
  totalPercent = totalPercent
  rand = Math.random() * totalPercent

  // Get Chances
  const chances : Array<number> = []
  let acc = 0
  list.forEach(i => {
    acc = parseFloat(String(acc)) + (parseFloat(String(i.percent)))
    chances.push(acc)
  })

  // Get Index
  let index : number = 0
  chances.forEach(i => {
    if(i <= rand){
      index = index + 1
    }
  })

  return list[index]
}

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth

    const body = await readBody(event)
    const { row, index, server, role } = body
    if(!server || !role || !row || !index) throw 'Dữ liệu đầu vào sai'

    // @ts-expect-error
    const rowNumber = rowFormatNumber[row]
    if(rowNumber > 6 || rowNumber < 1) throw 'Hàng chọn không hợp lệ'
    if(1 > index || index > rowNumber) throw 'Trứng chọn không hợp lệ'

    // Web Config
    const webConfig = await DB.Config.findOne().select('enable') as IDBConfig
    if(!webConfig) throw 'Không tìm thấy cấu hình trang'
    if(!webConfig.enable.play) throw 'Trò chơi đang bảo trì, vui lòng quay lại sau'

    // Get User
    const user = await DB.User.findOne({ _id: auth._id }).select('currency.coin') as IDBUser
    if(!user) throw 'Không tìm thấy thông tin tài khoản'

    // Get Config Egg
    const configEgg = await DB.Egg.findOne({})
    .select(`${row}`) 
    .populate({ path: `${row}.gift.item`, select: 'item_id item_name item_image type' }) as IDBEgg
    if(!configEgg) throw 'Không tìm thấy cấu hình đập trứng'
    // @ts-expect-error
    if(!configEgg[row]) throw 'Không tìm thấy cấu hình hàng chọn không hợp lệ'
    // @ts-expect-error
    const price = configEgg[row]['price']
    if(!price) throw 'Không lấy được cấu hình giá đập của hàng chọn'
    if(user.currency.coin < price) throw 'Số dư xu của bạn không đủ'
    // @ts-expect-error
    const gift = configEgg[row]['gift']
    if(!gift) throw 'Không lấy được cấu hình phần thưởng của hàng chọn'
    if(gift.length == 0) throw 'Hàng này chưa có phần thưởng, vui lòng quay lại sau'

    // Get Egg User
    const eggUser = await DB.EggUser.findOne({ user: auth._id }) as IDBUser
    if(!eggUser) throw 'Không lấy được dữ liệu tháp trứng, vui lòng tải lại trang'
    
    // Check Row Down
    if(rowNumber < 6){
      const rowDownNumber = rowNumber + 1
      // @ts-expect-error
      const rowDownUser = eggUser[numberFormatRow[rowDownNumber]]
      if(rowDownUser.length != rowDownNumber) throw 'Vui lòng mở hết hàng dưới trước'
    }

    // Check Had Open
    // @ts-expect-error
    const indexCheck = eggUser[row].findLastIndex((i : any) => i.index == index)
    if(indexCheck >= 0) throw 'Quả trứng này bạn đã mở rồi'

    // Random Gift
    const resultGift = getRandomGift(gift)
    if(!resultGift) throw 'Có lỗi xảy ra, vui lòng thử lại sau'

    // Send Item
    const item = resultGift.item
    if(item.type == 'game_item'){
      await gameSendMail(event, {
        account: auth.username,
        server_id: server,
        role_id: role,
        title: 'Web Lucky Egg',
        content: 'Vật phẩm nhận từ đập trứng may mắn trên Web',
        items: [{ 
          id: item.item_id, 
          amount: resultGift.amount 
        }]
      })
    }
    if(!!currencyTypeList.includes(item.type)){
      await DB.User.updateOne({ _id: auth._id }, { $inc: { [`currency.${item.type}`]: resultGift.amount } })
    }

    // History
    const history = await DB.EggHistory.create({
      user: auth._id,
      row: row,
      index: index,
      item: item._id,
      price: price,
      amount: resultGift.amount,
      percent: resultGift.percent,
      server: server,
      role: role,
    })

    // Update User
    await DB.User.updateOne({ _id: auth._id },{
      $inc: {
        'currency.coin': parseInt(price) * -1,
        'spend.total.coin': price,
        'spend.day.coin': price,
        'spend.month.coin': price
      }
    })

    // Update Egg User
    if(rowNumber == 1 && index == 1) await DB.EggUser.updateOne({ user: auth._id }, { one: [], two: [], three: [], four: [], five: [], six: [] })
    else await DB.EggUser.updateOne({ user: auth._id }, { $push: { [`${row}`]: { index: index, history: history._id } }})

    // Log User
    // @ts-expect-error
    await logUser(event, auth._id, `Dùng <b>${price.toLocaleString('vi-VN')}</b> xu để đập trứng <b>Hàng ${rowFormatNumber[row]} - ${index}</b>`)

    !!IO && IO.to(auth._id.toString()).emit('auth-update')
    return resp(event, { result: resultGift })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})