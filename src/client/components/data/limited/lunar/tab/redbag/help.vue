<template>
  <div class="w-full lunar-box p-1 rounded-2xl mt-[-10px]">
    <div class="lunar-box-content p-2">
      <UiText class="text-xs sm:text-base lunar-text" v-html="info('limitedLunarRedbagHelpA1', {
        day: useMoney().toMoney(eventData.redbag.day)
      })" />

      <UiText class="text-xs sm:text-base lunar-text" v-html="info('limitedLunarRedbagHelpA', {
        money: useMoney().toMoney(eventData.redbag.share)
      })" />

      <UiText class="text-xs sm:text-base lunar-text" v-html="info('limitedLunarRedbagHelpB')" />

      <UiText class="text-xs sm:text-base lunar-text" v-html="info('limitedLunarRedbagHelpC')" />

      <UiText class="text-xs sm:text-base lunar-text" v-html="info('limitedLunarRedbagHelpD')" />

      <div class="lunar-box rounded-2xl p-2 my-1">
        <DataItemList :items="eventData.redbag.random" justify="center" :size="60"/>
      </div>

      <UiText class="text-xs sm:text-base lunar-text" v-html="info('limitedLunarRedbagHelpE')" />

    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
const configStore = useConfigStore()
const eventData = computed(() => configStore.eventLimited.lunar.data)
const info = (key, obj) => t(key, { b1: '<span class="lunar-text-2">', b2: '</span>', ...obj })
</script>