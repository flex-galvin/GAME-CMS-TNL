export default defineEventHandler(async (event) => {
  try {
    const count = await DB.SocketChat.count()
    if(count < 1) await createChat(event, 'bot', 'Để lại lời nhắn, cùng nhau trò chuyện với mọi người nhé...')

    const { size, skip } = await readBody(event)

    const list = await DB.SocketChat
    .find({})
    .select('-updatedAt')
    .populate({ 
      path: 'user', 
      select: 'username level avatar type', 
      populate: {
        path: 'level', select: 'number'
      }
    })
    .sort({ createdAt: -1 })
    .limit(size)
    .skip(skip)

    return resp(event, { result: list })
  } 
  catch (e:any) {
    return resp(event, { result: [] })
  }
})