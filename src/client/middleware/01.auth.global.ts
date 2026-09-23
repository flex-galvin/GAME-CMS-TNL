export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore()
  const runtimeConfig = useRuntimeConfig()
  const token = useCookie('token-auth', runtimeConfig.public.cookieConfig)

  try {
    if(!token.value) throw true
    await authStore.setAuth()
  }
  catch(e){
    token.value = null
  }
})