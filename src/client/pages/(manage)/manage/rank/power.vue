<template>
  <UiContent :title="t('menuManageRankPower')" :sub="t('menuManageRankPowerInfo')">
    <UiFlex class="mb-1">
      <UTabs v-model="tab" :items="tabs"></UTabs>
    </UiFlex>

    <ManageRankProcessPower v-if="tab == 0" />
    <ManageRankMissionPower v-if="tab == 1" />
  </UiContent>
</template>

<script setup>
const { t } = useI18n()
const tab = ref(0)
const tabs = [
  { label: t('menuRankTop'), key: 'top' },
  { label: t('menuRankMission'), key: 'mission' },
]
</script>
