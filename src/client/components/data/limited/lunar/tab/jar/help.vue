<template>
  <div class="w-full lunar-box p-1 rounded-2xl">
    <div class="lunar-box-content p-2">
      <UiText class="text-xs sm:text-base mb-1 lunar-text" v-html="info('limitedLunarJarHelpA', {
        min: useMoney().toMoney(eventData.jar.min)
      })" />

      <UiText class="text-xs sm:text-base mb-1 lunar-text" v-html="info('limitedLunarJarHelpB')" />

      <UiText class="text-xs sm:text-base mb-1 lunar-text" v-html="info('limitedLunarJarHelpC', {
        max: useMoney().toMoney(eventData.top.max)
      })" />

      <UiText class="text-xs sm:text-base mb-1 lunar-text" v-html="info('limitedLunarJarHelpD')" />
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
const configStore = useConfigStore()
const eventData = computed(() => configStore.eventLimited.lunar.data)
const info = (key, obj) => t(key, { b1: '<span class="lunar-text-2">', b2: '</span>', ...obj })
</script>