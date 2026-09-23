<template>
  <UiFlex v-if="!!isPortrait" justify="center" class="fixed bg-black/50 backdrop-blur-lg w-full h-full top-0 left-0 z-[90] p-6">
    <UiFlex type="col" justify="center" class="bg-gray-1000 rounded-2xl p-8 max-w-xs">
      <UiIcon name="i-mdi-phone-rotate-landscape" size="20" color="primary" class="animate-bounce" />
      <UiText align="center" class="mt-4">{{ t('gameOrientation') }}</UiText>
    </UiFlex>
  </UiFlex>
</template>

<script setup>
import { useScreenOrientation } from '@vueuse/core'
const configStore = useConfigStore()
const { isSupported, orientation } = useScreenOrientation ()
const { t } = useI18n()

const isPortrait = computed(() => {
  if(!isSupported.value) return false
  if(!configStore.config.game.landscape) return false
  return orientation.value?.includes('portrait')
})
</script>