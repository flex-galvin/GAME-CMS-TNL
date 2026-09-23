<template>
  <UiContent :title="t('menuManageMinigameHistory')" :sub="t('menuManageMinigameHistoryInfo')">
    <UiFlex class="mb-1">
      <UTabs v-model="tab" :items="tabs"></UTabs>
    </UiFlex>

    <ManageMinigameHistoryWheel v-if="tab == 0" />
    <ManageMinigameHistoryEgg v-if="tab == 1" />
  </UiContent>
</template>

<script setup>
const { t } = useI18n()
const tab = ref(0)
const tabs = [
  { label: t('menuManageMinigameWheel'), key: 'wheel' },
  { label: t('menuManageMinigameEgg'), key: 'egg' },
]
</script>
