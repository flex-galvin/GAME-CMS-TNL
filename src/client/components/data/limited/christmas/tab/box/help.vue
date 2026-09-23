<template>
  <UiFlex type="col" class="w-full" justify="center">
    <div class="christmas-ribbon text-sm sm:text-base md:text-xl font-semibold z-[1]">
      {{ t('help') }}
    </div>
    
    <div class="w-full christmas-box p-1 rounded-2xl mt-[-10px] christmas-text-3">
      <div class="christmas-box-content p-2">
        <UiText class="text-xs sm:text-base" v-html="info('limiteddChristmasBoxHelpA', {
          money: useMoney().toMoney(eventData.box.share)
        })" />

        <UiText class="text-xs sm:text-base" v-html="info('limiteddChristmasBoxHelpB')" />

        <UiText class="text-xs sm:text-base" v-html="info('limiteddChristmasBoxHelpC')" />

        <UiText class="text-xs sm:text-base" v-html="info('limiteddChristmasBoxHelpD')" />

        <div class="christmas-box-gift rounded-2xl p-2 mt-1">
          <DataItemList :items="eventData.box.random" justify="center" :size="60"/>
        </div>
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