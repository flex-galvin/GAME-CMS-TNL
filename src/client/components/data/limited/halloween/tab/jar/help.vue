<template>
  <div class="halloween-box p-4 rounded-2xl">
    <div class="mb-4">
      <UiText class="halloween-text text-sm sm:text-base md:text-lg HLW-1 mb-1 uppercase" weight="bold">
        {{ t('help') }}
      </UiText>
      
      <UiText class="text-xs sm:text-base mb-1" v-html="info('limitedHalloweenJarHelpA', {
        min: useMoney().toMoney(eventData.jar.min)
      })" />

      <UiText class="text-xs sm:text-base mb-1" v-html="info('limitedHalloweenJarHelpB')" />

      <UiText class="text-xs sm:text-base mb-1" v-html="info('limitedHalloweenJarHelpC', {
        max: eventData.top.max
      })" />
    </div>
    <div>
      <UiText class="halloween-text text-sm sm:text-base md:text-lg HLW-1 mb-1 uppercase " weight="bold">
        {{ t('award') }}
      </UiText>

      <UiText class="text-xs sm:text-base mb-3">{{ t('limitedHalloweenJarHelpD') }}</UiText>
      <div class="bg-card-box rounded-2xl p-2">
        <DataItemList :items="eventData.jar.reward" justify="center" :size="60"/>
      </div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
const configStore = useConfigStore()
const eventData = computed(() => configStore.eventLimited.halloween.data)
const info = (key, obj) => t(key, { b1: '<span class="halloween-text">', b2: '</span>', ...obj })
</script>