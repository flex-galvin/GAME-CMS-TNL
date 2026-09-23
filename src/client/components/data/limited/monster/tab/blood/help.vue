<template>
  <div class="monster-box p-4 rounded-2xl">
    <UiText class="text-xs sm:text-base mb-1" v-html="info('limiteddMonsterBloodHelpA', {
      min: useMoney().toMoney(eventData.blood.min)
    })" />

    <UiText class="text-xs sm:text-base mb-1" v-html="info('limiteddMonsterBloodHelpB')" />

    <UiText class="text-xs sm:text-base mb-1" v-html="info('limiteddMonsterBloodHelpC', {
      max: eventData.top.max
    })" />

    <UiText class="text-xs sm:text-base mb-3" v-html="info('limiteddMonsterBloodHelpD')" />

    <div class="monster-box-2 rounded-2xl p-2">
      <DataItemList :items="eventData.lasthit.reward" justify="center" :size="50"/>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
const configStore = useConfigStore()
const eventData = computed(() => configStore.eventLimited.monster.data)
const info = (key, obj) => t(key, { b1: '<span class="monster-text">', b2: '</span>', ...obj })
</script>