<template>
  <div class="relative w-full h-full min-w-full min-h-full max-w-full max-h-full overflow-hidden">
    <slot></slot>

    <DataNotice />
    <MainLimited />
  </div>
</template>

<script setup>
const { t } = useI18n()
const { $socket } = useNuxtApp()

useSeoMeta({
  title: () => t('playing'),
  robots: 'none'
})

const authStore = useAuthStore()
watch(() => authStore.isLogin, (val) => !val && useTo().navigateToSSL('/'))

// Init Socket
onMounted(() => {
  $socket.on('recharge-done', data => {
    if(data.account && data.account == authStore.profile.username){
      data.type = 'recharge-done'
      const iframe = document.querySelector("iframe")
      iframe.contentWindow.postMessage(JSON.stringify(data), "*")
    }
  })

  // $socket.on('mail-done', data => {
  //   if(data.account && data.account == authStore.profile.username){
  //     data.type = 'mail-done'
  //     const iframe = document.querySelector("iframe")
  //     iframe.contentWindow.postMessage(JSON.stringify(data), "*")
  //   }
  // })
})
</script>