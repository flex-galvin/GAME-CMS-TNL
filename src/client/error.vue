<template>
  <UiFlex type="col" justify="center" class="w-full h-full fixed top-0 left-0 overflow-hidden p-6 ">
    <DotLottieVue autoplay loop src="/animation/page/error.lottie" class="w-full max-w-[700px]" />

    <UiText class="FTV text-[#87d0b9] text-[2.5rem] sm:text-[3.5rem] md:text-[4rem] -mt-4" weight="bold" align="center">
      {{ error.statusCode }}
    </UiText>

    <UiText align="center" class="UT -mt-2 text-base md:text-xl mb-4 break-all max-w-[600px] !text-white">
      {{ error.message || error.statusMessage || t('errorUnknown') }}
    </UiText>

    <UiFlex class="gap-2 absolute top-4 left-4 cursor-pointer !text-white" @click="goBackOrHome">
      <UiIcon name="i-lets-icons-back" size="6"></UiIcon>
      <UiText size="sm" weight="semibold">{{ !!canGoBack ? t('back') : t('home') }}</UiText>
    </UiFlex>
  </UiFlex>
</template>

<script setup>
const { t } = useI18n()
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
const configStore = useConfigStore()
const router = useRouter()
const props = defineProps({
  error: Object
})

useSeoMeta({
  title: `${props.error.statusCode} - ${configStore.config.name}`,
  description: props.error.message || props.error.statusMessage,
  ogDescription: props.error.message || props.error.statusMessage,
})

const previousUrl = ref('')
const canGoBack = ref(false)

const goBackOrHome = () => {
  if (canGoBack.value) router.back()
  else useTo().navigateToSSL('/')
}

onMounted(() => {
  previousUrl.value = document.referrer
  const isSameOrigin = previousUrl.value.startsWith(window.location.origin)
  canGoBack.value = isSameOrigin && window.history.length > 1
})
</script>