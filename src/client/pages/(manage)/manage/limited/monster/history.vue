<template>
  <UiContent :title="t('menuManageLimitedMonsterHistory')" :sub="t('menuManageLimitedMonsterHistoryInfo')">
    <UiFlex class="mb-1">
      <UTabs v-model="tab" :items="tabs"></UTabs>
    </UiFlex>

    <ManageLimitedMonsterHistoryBlood v-if="tab == 0" />
    <ManageLimitedMonsterHistoryTop v-if="tab == 1" />
  </UiContent>
</template>

<script setup>
const { t } = useI18n()

const tab = ref(0)
const tabs = [
  { label: t('limitedMonsterBlood'), key: 'jar' },
  { label: t('limitedMonsterTop'), key: 'top' },
]
</script>
