import type { IAuth, IDBItem } from "~~/types"

const typeList = [
  'game_item', 'game_recharge'
]

export default defineEventHandler(async (event) => {
  try {
    const auth = await getAuth(event) as IAuth
    await checkPermission(event, 'item.del')

    const { _id } = await readBody(event)
    if(!_id) throw 'Dữ liệu đầu vào không hợp lệ'

    const item = await DB.Item.findOne({ _id: _id }).select('_id type item_name') as IDBItem
    if(!item) throw 'Vật phẩm không tồn tại'
    if(!typeList.includes(item.type)) throw 'Không thể xóa vật phẩm mặc định'

    const itemBox = await DB.ItemBox.count({ gift: { $elemMatch: { item: _id }} })
    if(itemBox > 0) throw 'Không thể xóa vật phẩm đã có bộ vật phẩm'

    const shop = await DB.Shop.count({ item: _id })
    if(shop > 0) throw 'Không thể xóa vật phẩm đã có trong cửa hàng'
    const shopHistories = await DB.ShopHistory.count({ item: _id })
    if(shopHistories > 0) throw 'Không thể xóa vật phẩm đã có trong lịch sử cửa hàng'
    const shopPack = await DB.ShopPack.count({ gift: { $elemMatch: { item: _id }} })
    if(shopPack > 0) throw 'Không thể xóa vật phẩm đã có trong cửa hàng gói vật phẩm'

    const evt = await DB.Event.count({ gift: { $elemMatch: { item: _id }} })
    if(evt > 0) throw 'Không thể xóa vật phẩm đã có trong sự kiện'

    const giftcode = await DB.Giftcode.count({ gift: { $elemMatch: { item: _id }} })
    if(giftcode > 0) throw 'Không thể xóa vật phẩm đã có trong giftcode'

    const wheel = await DB.Wheel.count({ item: _id })
    if(wheel > 0) throw 'Không thể xóa vật phẩm đã có trong vòng quay'
    const wheelHistories = await DB.WheelHistory.count({ item: _id })
    if(wheelHistories > 0) throw 'Không thể xóa vật phẩm đã có trong lịch sử vòng quay'

    const eggs = await DB.Egg.count({ $or: [
      { 'one.gift': { $elemMatch: { item: _id }} },
      { 'two.gift': { $elemMatch: { item: _id }} },
      { 'three.gift': { $elemMatch: { item: _id }} },
      { 'four.gift': { $elemMatch: { item: _id }} },
      { 'five.gift': { $elemMatch: { item: _id }} },
      { 'six.gift': { $elemMatch: { item: _id }} },
    ]})
    if(eggs > 0) throw 'Không thể xóa vật phẩm đã có trong đập trứng'
    const eggHistories = await DB.EggHistory.count({ item: _id })
    if(eggHistories > 0) throw 'Không thể xóa vật phẩm đã có trong lịch sử đập trứng'

    const logSendItem = await DB.LogAdminSendItem.count({ gift: { $elemMatch: { item: _id }} })
    if(logSendItem > 0) throw 'Không thể xóa vật phẩm đã có nhật ký gửi vật phẩm'

    const levelGiftInvited = await DB.Level.count({ gift_invited: { $elemMatch: { item: _id }} })
    if(levelGiftInvited > 0) throw 'Không thể xóa vật phẩm đã có trong quà mời bạn'

    const rankPowerUp = await DB.GameRankPowerUpProcess.count({ 'award.gift': { $elemMatch: { item: _id }} })
    if(rankPowerUp > 0) throw 'Không thể xóa vật phẩm đã có trong sự kiện tăng lực chiến'

    const rankProcess = await DB.GameRankProcess.count({ 'award.gift': { $elemMatch: { item: _id }} })
    if(rankProcess > 0) throw 'Không thể xóa vật phẩm đã có trong sự kiện đua top máy chủ'

    await DB.Item.deleteOne({ _id: _id })
    await logAdmin(event, `Xóa vật phẩm trò chơi <b>${item.item_name}</b>`)
    return resp(event, { message: 'Xóa thành công' })
  } 
  catch (e:any) {
    return resp(event, { code: 400, message: e.toString() })
  }
})