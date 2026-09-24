<template>
  <UiFlex 
    v-if="!!eventData"
    class="
      color-pay-light bg-box-light bg-box-light--active-before 
      rounded-2xl 
      gap-4 
      pr-1
      overflow-hidden
      h-[150px] max:h-[150px]
      cursor-pointer
    "
    @click="configStore.setEventLimitedModal('pay', true)"
  >
    <div class="grow z-[2] pl-[80px]">
      <DotLottieVue autoplay loop src="/animation/pay/cash.lottie" class="absolute h-[90px] left-[-30px] bottom-[10px]" /> 

      <UiFlex type="col" class="gap-1" items="center">
        <UiText class="FTV text-xl limited-pay-text-title" align="center">{{ t('menuLimitedPay') }}</UiText>

        <UiText class="FTV uppercase" align="center" size="xl">
          <UiCountdown :time="eventData.time.end" />
        </UiText>
      </UiFlex>
    </div>
  </UiFlex>
</template>

<script setup>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
const { t } = useI18n()
const configStore = useConfigStore()
const eventData = computed(() => configStore.eventLimited.pay.data)
</script>