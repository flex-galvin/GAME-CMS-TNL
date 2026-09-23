export default defineNuxtRouteMiddleware(async (to, from) => {
  try {
    const runtimeConfig = useRuntimeConfig()
    const authStore = useAuthStore()
    const configStore = useConfigStore()
    if(!authStore.isLogin || !authStore.profile) throw true
    if(!configStore.config.enable.play){
      if((authStore.profile.type as number) < 1) throw true
    }
    if(!to.query.token) throw true
  }
  catch (e:any) {
    return useTo().navigateToSSL('/')
  }
})