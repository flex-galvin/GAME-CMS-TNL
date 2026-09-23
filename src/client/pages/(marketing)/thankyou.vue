<template>
  <UiFlex type="col" justify="center" class="h-full p-6" @click="start" v-if="!!authStore.isLogin">
    <UiImg src="/images/tqc/thankyou.png" :w="1" :h="1" class="w-full max-w-[400px]" />

    <UiText weight="bold" class="uppercase text-gradient text-xl sm:text-2xl md:text-3xl break-all my-4" align="center">
      Chào mừng thành viên mới
    </UiText>

    <UiIcon name="i-bx-loader-alt" class="animate-spin h-8 w-8 md:h-10 md:w-10" />
  </UiFlex>
</template>

<script setup>
const { t } = useI18n()

const configStore = useConfigStore()
const authStore = useAuthStore()

definePageMeta({
  layout: false,
  middleware: 'user'
})

useSeoMeta({
  title: () => `Thank You - ${configStore.config.name}`,
  robots: 'none'
})

useHead({
  script: [
    { children: `fbq('track', 'ThankYou');`}
  ],
})

const start = async () => {
  try {
    if(!!configStore.config.thankyou.link) return location.href = configStore.config.thankyou.link
    if(!!configStore.config.game.mobile) return location.href = '/'

    const token = await useAPI('game/public/start')
    usePlay().guest(token)
  }
  catch (e) {
    location.href = '/'
  }
}

onMounted(() => setTimeout(start, 2000))
</script>