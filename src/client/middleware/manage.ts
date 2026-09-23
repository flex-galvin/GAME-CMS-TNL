export default defineNuxtRouteMiddleware(async () => {
  try {
    const authStore = useAuthStore()
    if(!authStore.isLogin || !authStore.profile) throw true
    if(authStore.profile.type == undefined) throw true
    if(authStore.profile.type < 1) throw true

    const runtimeConfig = useRuntimeConfig()
    const token = useCookie('eni-manage', runtimeConfig.public.cookieManageConfig)
    if(!token.value) return useTo().navigateToSSL('/admin')

    await useAPI('auth/manage/token')
  }
  catch (e:any) {
    return useTo().navigateToSSL('/admin')
  }
})