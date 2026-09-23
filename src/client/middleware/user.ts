export default defineNuxtRouteMiddleware(async () => {
  try {
    const authStore = useAuthStore()
    if(!authStore.isLogin || !authStore.profile) throw true
  }
  catch (e:any) {
    return useTo().navigateToSSL('/')
  }
})