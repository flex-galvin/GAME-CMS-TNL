<template>
  <UiContent :title="t('menuManageLimitedLunarHistory')" :sub="t('menuManageLimitedLunarHistoryInfo')">
    <UiFlex class="mb-1">
      <UTabs v-model="tab" :items="tabs"></UTabs>
    </UiFlex>

    <ManageLimitedLunarHistoryUser v-if="tab == 0" />
    <ManageLimitedLunarHistoryJar v-if="tab == 1" />
    <ManageLimitedLunarHistoryTop v-if="tab == 2" />
    <ManageLimitedLunarHistoryRedbag v-if="tab == 3" />
    <ManageLimitedLunarHistoryRedbagStep v-if="tab == 4" />
    <ManageLimitedLunarHistoryPiece v-if="tab == 5" />
    <ManageLimitedLunarHistoryPieceReward v-if="tab == 6" />
  </UiContent>
</template>

<script setup>
const { t } = useI18n()

const tab = ref(0)
const tabs = [
  { label: t('limitedLunarUserTab'), key: 'user' },
  { label: t('limitedLunarJarTab'), key: 'jar' },
  { label: t('limitedLunarTopTab'), key: 'top' },
  { label: t('limitedLunarRedbagTab'), key: 'redbag' },
  { label: t('limitedLunarRedbagStepTab'), key: 'redbag-step' },
  { label: t('limitedLunarPieceTab'), key: 'piece' },
  { label: t('limitedLunarPieceRewardTab'), key: 'piece-reward' },
]
</script>
