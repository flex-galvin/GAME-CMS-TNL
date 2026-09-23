<template>
  <div>
    <UiFlex justify="center" class="bg-animate px-2 sm:px-3 h-[35px] sm:h-[42.5px] rounded-2xl cursor-pointer gap-1.5" @click="open" v-if="!custom">
      <UiIcon name="bx-play" class="h-5 w-5 jump-anim hidden sm:inline" />
      <UiText weight="bold" mini class="text-xs sm:text-sm uppercase">{{ configStore.config.game.mobile ? t('downloadBtn') : t('playBtn')}}</UiText>
    </UiFlex>

    <slot :open="open"></slot>

    <UModal v-model="modal" :ui="{ width: 'sm:max-w-[420px]' }">
      <div class="bg-card p-4 rounded-3xl">
        <UiFlex justify="center" class="bg-card-box cursor-pointer w-full rounded-2xl p-4 gap-2 mb-1" @click="playWeb()" v-if="!configStore.config.game.mobile">
          <UiIcon name="i-bx-world" size="8"></UiIcon>
          <UiText weight="semibold" size="lg" class="w-full" align="end">{{ t('osWeb') }}</UiText>
        </UiFlex>

        <UiFlex justify="center" class="bg-green-700/20 cursor-pointer w-full rounded-2xl p-4 gap-2" @click="download(configStore.config.download.apk, 'android')">
          <UiIcon name="i-bxl-android" size="8"></UiIcon>
          <UiText weight="semibold" size="lg" class="w-full" align="end">{{ t('osAndroid') }}</UiText>
        </UiFlex>

        <UiFlex justify="center" class="bg-black/50 cursor-pointer w-full rounded-2xl p-4 gap-2" @click="download(configStore.config.download.ios, 'ios')">
          <UiIcon name="i-bxl-apple" size="8"></UiIcon>
          <UiText weight="semibold" size="lg" class="w-full" align="end">{{ t('osIOS') }}</UiText>
        </UiFlex>
      </div>
    </UModal>

    <UModal v-model="iosPWA" preventClose :ui="{ width: 'sm:max-w-[400px]' }">
      <UiContent :title="t('osIOSInstall')" :sub="t('osIOSInstallInfo')" class="bg-card rounded-2xl p-4">
         <template #more>
          <UButton icon="i-bx-x" color="gray" class="ml-auto" size="2xs" square @click="iosPWA = false"></UButton>
        </template>

        <UiFlex class="flex gap-1 mb-2" wrap>
          {{ t('osIOSInstallGuide1a') }}
          <UiIcon name="i-ion-share-outline" color="yellow" size="5" />
          <strong class="text-yellow-500">{{ t('osIOSInstallGuide1b') }}</strong> 
        </UiFlex>

        <UiFlex class="flex gap-1" wrap>
          {{ t('osIOSInstallGuide2a') }}
          <UiIcon name="i-icon-park-outline-add" color="yellow" size="5" />
          <strong class="text-yellow-500">{{ t('osIOSInstallGuide2b') }}</strong> 
        </UiFlex>
      </UiContent>
    </UModal>
  </div>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps(['custom'])
const configStore = useConfigStore()
const authStore = useAuthStore()

const loading = ref(false)
const modal = ref(false)
const iosPWA = ref(false)
const isClickOpenButNotAuth = ref(false)

const isInAppBrowser = () => {
  const ua = navigator.userAgent || navigator.vendor || window.opera
  if (ua.includes('FBAN') || ua.includes('FBAV')) return true
  if (ua.includes('Instagram')) return true
  if (ua.includes('Messenger')) return true
  if (ua.includes('Zalo')) return true
  return false
}

const isPWAInstall = () => {
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
}

const open = () => {
  if(!authStore.isLogin) return isClickOpenButNotAuth.value = true, authStore.setModal(true)
  if(!!configStore.config.game.mobile) return modal.value = true // Is Mobile Game (Open Modal)
  if(!!isInAppBrowser()) return playWeb() // Is H5 Game (If web open In-App => Play now)
  if(!!isPWAInstall()) return playWeb() // Is PWA Install (If had PWA Install => Play now)
  return modal.value = true
}

const download = async (url, type) => {
  if(type == 'ios' && !configStore.config.game.mobile) return modal.value = false, iosPWA.value = true
  if(type == 'android' && !configStore.config.game.mobile && !!configStore.installPrompt && !url){
    await configStore.installPrompt.prompt()
    configStore.setInstallPrompt(null)
    return
  }

  if(!url) return useNotify().error(t('emptyUrl'))
  const link = document.createElement('a')
  link.href = url
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const playWeb = async () => {
  try {
    loading.value = true
    const token = await useAPI('game/public/start')

    loading.value = false
    usePlay().guest(token)
  }
  catch (e) {
    loading.value = false
  }
}

watch(() => authStore.isLogin, (val) => !!val && !!isClickOpenButNotAuth.value && open())
</script>