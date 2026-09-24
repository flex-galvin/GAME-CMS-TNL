<template>
  <UiFlex 
    v-if="eventData"
    class="
      LunarBanner
      rounded-2xl 
      overflow-hidden
      w-full
      h-[150px] max:h-[150px]
      cursor-pointer
    "
    @click="configStore.setEventLimitedModal('lunar', true)"
  >
    <UiFlex class="z-[2] right-[10px] w-[150px] h-[43px] mt-2 absolute p-2" justify="center">
      <UiText class="lunar-text-title FTV uppercase" mini align="center" v-if="!eventData.rewardTime" >
        <UiCountdown :time="eventData.time.end" />
      </UiText>
      <UiText class="lunar-text-title FTV uppercase" mini size="xs" align="center" v-else >
        Nhận Thưởng
      </UiText>
    </UiFlex>
  </UiFlex>
</template>

<script setup>
  import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
const { t } = useI18n()
const configStore = useConfigStore()
const eventData = computed(() => configStore.eventLimited.lunar.data)
</script>