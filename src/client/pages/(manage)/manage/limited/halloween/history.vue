<template>
  <UiContent :title="t('menuManageLimitedHalloweenHistory')" :sub="t('menuManageLimitedHalloweenHistoryInfo')">
    <UiFlex class="mb-1">
      <UTabs v-model="tab" :items="tabs"></UTabs>
    </UiFlex>

    <ManageLimitedHalloweenHistoryJar v-if="tab == 0" />
    <ManageLimitedHalloweenHistoryTop v-if="tab == 1" />
    <ManageLimitedHalloweenHistoryPumpkin v-if="tab == 2" />
  </UiContent>
</template>

<script setup>
const { t } = useI18n()

const tab = ref(0)
const tabs = [
  { label: t('limitedHalloweenJar'), key: 'jar' },
  { label: t('limitedHalloweenTop'), key: 'top' },
  { label: t('limitedHalloweenPumpkin'), key: 'pumpkin' },
]
</script>
