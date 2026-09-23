export default defineNuxtRouteMiddleware(async () => {
  try {
    const authStore = useAuthStore()
    if(!authStore.isLogin || !authStore.profile) return useTo().navigateToSSL('/')
    if(authStore.profile.type == undefined) return useTo().navigateToSSL('/')
    if(authStore.profile.type < 1) return useTo().navigateToSSL('/')

    const runtimeConfig = useRuntimeConfig()
    const token = useCookie('eni-manage', runtimeConfig.public.cookieManageConfig)
    if(!!token.value) return useTo().navigateToSSL('/manage')
    
    await useAPI('ip/whitelist/check')
    return useTo().navigateToSSL('/manage')
  }
  catch (e:any) {
    //return false
  }
})