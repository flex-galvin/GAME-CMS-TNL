<template>
  <UiFlex type="col" justify="center" class="h-full p-6" @click="start" v-if="!!authStore.isLogin">
    <DotLottieVue autoplay src="/animation/page/thank.lottie" class="w-full max-w-[700px]" />

    <UiText weight="bold" class="FTV text-[#8bffac] text-2xl sm:text-3xl md:text-4xl break-all my-2" align="center">
      {{ t('hello') }}, {{ authStore.profile.username }}
    </UiText>

    <UiText class="mb-4 text-sm sm:text-lg md:text-xl" align="center">
      {{ t('thankyou', { a: configStore.config.name }) }}
    </UiText>

    <UiIcon name="i-bx-loader-alt" class="animate-spin text-[#8bffac] h-8 w-8 md:h-10 md:w-10" />
  </UiFlex>
</template>

<script setup>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
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