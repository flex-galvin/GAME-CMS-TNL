<template>
  <div>
    <UiFlex class="gap-2" wrap>
      <UiText class="text-gradient FTV mr-auto" weight="bold">Hiệu quả khách mới & khách cũ</UiText>

      <UiFlex class="gap-1">
        <SelectDate v-model="state.start" :placeholder="t('start')" time size="sm" />
        <SelectDate v-model="state.end" :placeholder="t('end')" time size="sm" />
      </UiFlex>
    </UiFlex>

    <UCard class="my-2" :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />
      
      <UTable :columns="selectedColumns" :rows="list">
        <template #totalUsers-data="{ row }">
          {{ useMoney().toMoney(row.totalUsers) }}
        </template>

        <template #retentionUsers-data="{ row }">
          {{ useMoney().toMoney(row.retentionUsers) }}
        </template>

        <template #payingUsers-data="{ row }">
          {{ useMoney().toMoney(row.payingUsers) }}
        </template>

        <template #revenue-data="{ row }">
          {{ useMoney().toMoney(row.revenue) }}
        </template>

        <template #arpu-data="{ row }">
          {{ useMoney().toMoney(row.arpu) }}
        </template>
      </UTable>
    </UCard>
  </div>
</template>

<script setup>
const { t } = useI18n()

// Loading
const loading = ref({
  load: false,
})

// Input
const state = ref({
  start: null,
  end: null
})
watch(() => state.value.start, (val) => {
  if(!!val && !!state.value.end) return getList()
  if(!val && !state.value.end) return getList()
})
watch(() => state.value.end, (val) => {
  if(!!val && !!state.value.start) return getList()
  if(!val && !state.value.start) return getList()
})

// List
const source = ref(null)
const list = computed(() => {
  if(!source.value) return []

  const totalUsers = source.value.totalUsers || 0
  if (!totalUsers) return []

  const buildRow = (label, data, hasRetention = true) => {
    const retentionUsers = hasRetention ? data.retentionUsers || 0 : 0
    const payingUsers = data.payingUsers || 0
    const revenue = data.revenue || 0

    return {
      time: label,
      totalUsers,
      retentionUsers,

      retentionUsersPer: hasRetention
        ? ((retentionUsers / totalUsers) * 100).toFixed(1) + '%'
        : '-',

      payingUsers,

      payingUsersPer:
        ((payingUsers / totalUsers) * 100).toFixed(1) + '%',

      revenue,

      arpu: Math.round(revenue / totalUsers)
    }
  }

  return [
    buildRow('R1 (1 ngày)', source.value.R1),
    buildRow('R3 (3 ngày)', source.value.R3),
    buildRow('R7 (7 ngày)', source.value.R7),
    buildRow('R15 (15 ngày)', source.value.R15),
    buildRow('RN+', source.value.RN, false)
  ]
})

// Columns
const columns = [
  {
    key: 'time',
    label: 'Mốc',
  },{
    key: 'totalUsers',
    label: 'Số khách mới',
  },{
    key: 'retentionUsers',
    label: 'Khách quay lại',
  },{
    key: 'retentionUsersPer',
    label: '% Quay lại',
  },{
    key: 'payingUsers',
    label: 'Khách nạp',
  },{
    key: 'payingUsersPer',
    label: '% Nạp',
  },{
    key: 'revenue',
    label: 'Doanh thu tổng',
  },{
    key: 'arpu',
    label: 'Doanh thu trung bình (ARPU)',
  }
]
const selectedColumns = ref([...columns])

// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('statistic/cohort', state.value)

    source.value = data
    loading.value.load = false
  }
  catch (e) {
    source.value = null
    loading.value.load = false
  } 
}
</script>

