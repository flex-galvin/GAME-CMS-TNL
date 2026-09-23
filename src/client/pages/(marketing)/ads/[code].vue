<template>
  <div class="w-full h-full fixed top-0 left-0 overflow-hidden HideScroll" v-if="!!landing">
    <iframe 
      title="Landing Page"
      :src="landing.link"
      width="100%"
      height="100%"
      class="Iframe"
    ></iframe>

    <div class="absolute w-full h-full top-0 left-0 cursor-pointer" @click="openSign"></div>

    <UModal v-model="modal">
      <div class="bg-card rounded-2xl p-4">
        <UiText weight="bold" class="OPS line-clamp-1 text-xl md:text-2xl text-gradient">{{ config.name }}</UiText>
        <UiText class="text-gray-400 text-sm md:text-base -mt-1 mb-2">{{ config.description }}</UiText>

        <UTabs v-model="tabItem" :items="tabItems"></UTabs>

        <UiEffectOb v-if="tabItem == 0">
          <AuthSignLandingIn @done="toThank" :landing="landing._id"/>
        </UiEffectOb>

        <UiEffectOb v-if="tabItem == 1">
          <AuthSignLandingUp @done="toThank" :landing="landing._id"/>
        </UiEffectOb>
        
        <DataGiftcodePublic v-if="tabItem == 2" :landing="true" @landing="tabItem = 0"></DataGiftcodePublic>
      </div>
    </UModal>
  </div>
</template>

<script setup>
const { t } = useI18n()
definePageMeta({
  layout: false
})

const configStore = useConfigStore()
const route = useRoute()

const authStore = useAuthStore()
const config = computed(() => configStore.config)

const modal = ref(false)
const landing = ref(undefined)

const tabItem = ref(1) 
const tabItems = [
  { label: t('signIn'), key: 'in' },
  { label: t('signUp'), key: 'up' },
  { label: t('menuGiftcode'), key: 'giftcode' },
]

const openSign = () => {
  if(!!authStore.isLogin) return start()
  modal.value = true
}

const toThank = async () => {
  useTo().navigateToSSL('/thankyou')
}

const start = async () => {
  try {
    const token = await useAPI('game/public/start')
    usePlay().guest(token)
  }
  catch (e) {
    useTo().navigateToSSL('/')
  }
}

const getLanding = async () => {
  try {
    const data = await useAPI('ads/landing/public/code', { code: route.params.code })
    landing.value = data

    if(!authStore.isLogin && !!data.onup){
      setTimeout(() => {
        modal.value = true
      }, 1500);
    }
  }
  catch (e) {
    return false
  }
}
getLanding()
</script>