export default defineNuxtPlugin(async (nuxtApp) => {
  const configStore = useConfigStore()
  const authStore = useAuthStore()
  const socketStore = useSocketStore()

  const { io } = await import('socket.io-client')

  const socket = io('/', {
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    randomizationFactor: 0.5,
  })

  socket.on("connect", () => {
    socketStore.setConnected(true)
    socket.emit('online-join', (authStore.isLogin && authStore.profile) ? authStore.profile._id : null)
  })

  socket.on("disconnect", (reason) => {
    socketStore.setConnected(false)
    if (reason === "io server disconnect") socket.connect()
  })

  socket.on('config-update', () => configStore.bootConfig()) // Cập nhật lại cấu hình trang

  socket.on('auth-update', async () => !!authStore.isLogin && await authStore.setAuth()) // Cập nhật lại thông tin tài khoản
  
  socket.on('online', (data) => socketStore.updateOnline(data)) // Cập nhật người trực tuyến
  socket.on('online-sign-in', () => socket.emit('notify-single-new')) // Lấy thông tin số thông báo mới
  
  socket.on('chat-global-push', (data) => socketStore.changeChatData('global', { push: { update: socketStore.chat.global.push.update + 1, data: data } })) // Nhận tin nhắn thế giới mới
  socket.on('chat-global-send-error', (data) => useNotify().error(data.message)) // Trả lỗi khi gửi tin nhắn thất bại
  
  socket.on('notify-single-new', data => socketStore.changeNotifyData('single', { new: data })) // Nhận thông tin số thông báo mới
  socket.on('notify-single-push', (data) => {
    socketStore.changeNotifyData('single', { push: { update: socketStore.notify.single.push.update + 1, data: data } }) // Nhận thông báo mới
    if(socketStore.tab != 'notify-single') return socket.emit('notify-single-new') // Không trong tab thông báo, thì nhận số thông báo mới
  })

  socket.on('notify-running-push', (data) => socketStore.changeNotifyData('running', { push: { update: socketStore.notify.running.push.update + 1, data: data } })) // Nhận thông báo chạy mới

  nuxtApp.provide('socket', socket)
  nuxtApp.provide('io', io)
})

declare module '#app' {
  interface NuxtApp {
    $io: typeof import('socket.io-client')['io']
    $socket: ReturnType<typeof import('socket.io-client')['io']>
  }
}