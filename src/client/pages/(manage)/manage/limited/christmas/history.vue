<template>
  <UiContent :title="t('menuManageLimitedChristmasHistory')" :sub="t('menuManageLimitedChristmasHistoryInfo')">
    <UiFlex class="mb-1">
      <UTabs v-model="tab" :items="tabs"></UTabs>
    </UiFlex>

    <ManageLimitedChristmasHistoryJar v-if="tab == 0" />
    <ManageLimitedChristmasHistoryTop v-if="tab == 1" />
    <ManageLimitedChristmasHistoryBox v-if="tab == 2" />
    <ManageLimitedChristmasHistoryBoxStep v-if="tab == 3" />
  </UiContent>
</template>

<script setup>
const { t } = useI18n()

const tab = ref(0)
const tabs = [
  { label: t('limitedChristmasJarTab'), key: 'jar' },
  { label: t('limitedChristmasTopTab'), key: 'top' },
  { label: t('limitedChristmasBoxTab'), key: 'box' },
  { label: t('limitedChristmasBoxStepTab'), key: 'box-step' },
]
</script>
