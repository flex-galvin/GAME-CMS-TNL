<template>
  <UiFlex type="col">
    <DotLottieVue autoplay loop src="/animation/page/error.lottie" class="w-full max-w-[700px]" />
    
    <UiText class="FTV text-[#87d0b9] text-[2.5rem] -mt-4" weight="bold" align="center">
      {{ t('maintenance') }}
    </UiText>

    <UiText color="gray" size="sm" align="center" class="-mt-1 text-base md:text-xl break-all max-w-[600px]">
      {{ t('maintenanceInfo') }}
    </UiText>
  </UiFlex>
</template>

<script setup>
const { t } = useI18n()
</script>