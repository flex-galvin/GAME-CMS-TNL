<template>
  <UiFlex type="col" class="w-full" justify="center">
    <div class="christmas-ribbon text-sm sm:text-base md:text-xl font-semibold z-[1]">
      {{ t('help') }}
    </div>
    
    <div class="w-full christmas-box p-1 rounded-2xl mt-[-10px]">
      <div class="christmas-box-content p-2">
        <UiText class="text-xs sm:text-base mb-1 christmas-text-3" v-html="info('limiteddChristmasJarHelpA', {
          min: useMoney().toMoney(eventData.jar.min)
        })" />

        <UiText class="text-xs sm:text-base mb-1 christmas-text-3" v-html="info('limiteddChristmasJarHelpB')" />

        <UiText class="text-xs sm:text-base mb-1 christmas-text-3" v-html="info('limiteddChristmasJarHelpC', {
          max: useMoney().toMoney(eventData.top.max)
        })" />

        <UiText class="text-xs sm:text-base mb-1 christmas-text-3" v-html="info('limiteddChristmasJarHelpD')" />
      </div>
    </div>
  </UiFlex>
</template>

<script setup>
const { t } = useI18n()
const configStore = useConfigStore()
const eventData = computed(() => configStore.eventLimited.christmas.data)
const info = (key, obj) => t(key, { b1: '<span class="christmas-text-2">', b2: '</span>', ...obj })
</script>