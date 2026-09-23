export default defineNuxtRouteMiddleware(async () => {
  const home = await useAPI('config/public/home')
  if(!!home) return navigateTo(home, { redirectCode: 301 })
})