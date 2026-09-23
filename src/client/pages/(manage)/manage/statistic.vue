<template>
  <UiContent :title="t('menuManageStatistical')" :sub="t('menuManageStatisticalInfo')">
    <ManageStatisticFast class="mb-4"/>

    <ManageStatisticCohort class="mb-4" />

    <div>
      <ManageChartLine class="mb-4" :source="source"/>

      <UiFlex class="mb-2 gap-2" wrap>
        <UiText class="mr-auto text-gradient FTV grow" weight="bold">Thống kê ngày</UiText>
        <UTabs v-model="tab" :items="tabs"></UTabs>
      </UiFlex>

      <ManageStatisticPayment v-if="tab == 0" v-model="source" />
      <ManageStatisticSpend v-if="tab == 1" v-model="source" />
      <ManageStatisticSignin v-if="tab == 2" v-model="source" />
      <ManageStatisticSignup v-if="tab == 3" v-model="source" />
    </div>
  </UiContent>
</template>

<script setup>
const { t } = useI18n()
const tab = ref(0)
const tabs = [
  { label: t('payment'), key: 'payment' },
  { label: t('spend'), key: 'spend' },
  { label: t('login'), key: 'signin' },
  { label: t('register'), key: 'signup' },
]

const source = ref([])
</script>