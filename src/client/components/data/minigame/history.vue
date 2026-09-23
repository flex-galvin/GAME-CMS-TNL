<template>
  <div>
    <UiFlex class="mb-1">
      <UTabs v-model="tab" :items="tabs"></UTabs>
    </UiFlex>

    <DataMinigameWheelHistory v-if="tab == 0" :user="user" />
    <DataMinigameEggHistory v-if="tab == 1" :user="user" />
  </div>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps(['user'])

const tab = ref(0)
const tabs = [
  { label: t('menuMinigameWheel'), key: 'wheel' },
  { label: t('menuMinigameEgg'), key: 'egg' }
]
</script>
