<template>
  <UiContent :title="t('menuManageShopHistory')" :sub="t('menuManageShopHistoryInfo')">
    <UiFlex class="mb-1">
      <UTabs v-model="tab" :items="tabs"></UTabs>
    </UiFlex>

    <ManageShopHistoryItem v-if="tab == 0" />
    <ManageShopHistoryPack v-if="tab == 1" />
  </UiContent>
</template>

<script setup>
const { t } = useI18n()
const tab = ref(0)
const tabs = [
  { label: t('menuShopItem'), key: 'item' },
  { label: t('menuShopPack'), key: 'pack' },
]
</script>
