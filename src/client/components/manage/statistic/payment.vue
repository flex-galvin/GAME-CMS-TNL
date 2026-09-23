<template>
  <div>
    <UiFlex class="gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" size="sm" class="mr-auto"/>
    
      <SelectDate v-model="page.range.start" :placeholder="t('start')" size="sm" />
      <SelectDate v-model="page.range.end" :placeholder="t('end')" size="sm" />
    </UiFlex>
    
    <!-- Table -->
    <UCard class="my-2" :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns"
        :rows="listFormat"
      >
        <template #time-data="{ row }">
          <UiText color="primary" weight="semibold">{{ row.time == 'ALL' ? t('total') : useDayJs().displayTime(row.time) }}</UiText>
        </template>

        <template #count_total-data="{ row }">
          <UiText 
            :color="row.time == 'ALL' ? 'primary' : null"
            :weight="row.time == 'ALL' ? 'bold' : null"
          >{{ useMoney().toMoney(row.count_total) }}</UiText>
        </template>

        <template #money_total-data="{ row }">
          <UiText 
            :color="row.time == 'ALL' ? 'primary' : null"
            :weight="row.time == 'ALL' ? 'bold' : null"
          >{{ useMoney().toMoney(row.money_total) }}</UiText>
        </template>

        <template #money_card-data="{ row }">
          <UiText>{{ useMoney().toMoney(row.money_card) }}</UiText>
        </template>

        <template #money_bank-data="{ row }">
          <UiText>{{ useMoney().toMoney(row.money_bank) }}</UiText>
        </template>

        <template #money_momo-data="{ row }">
          <UiText>{{ useMoney().toMoney(row.money_momo) }}</UiText>
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between">
      <USelectMenu v-model="selectedColumns" :options="columns" multiple :placeholder="t('selectColumns')" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="5" />
    </UiFlex>
  </div>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps(['modelValue'])
const emits = defineEmits(['update:modelValue'])

// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'time',
    label: t('time'),
    sortable: true
  },{
    key: 'count_total',
    label: t('transaction'),
    sortable: true
  },{
    key: 'count_waiting',
    label: t('statusPending'),
    sortable: true
  },{
    key: 'count_refuse',
    label: t('statusError'),
    sortable: true
  },{
    key: 'count_success',
    label: t('statusSuccess'),
    sortable: true
  },{
    key: 'money_total',
    label: t('total'),
    sortable: true
  },{
    key: 'money_card',
    label: t('gateCard'),
    sortable: true
  },{
    key: 'money_bank',
    label: t('gateBank'),
    sortable: true
  },{
    key: 'money_momo',
    label: t('gateMomo'),
    sortable: true
  }
]
const selectedColumns = ref([...columns])

// Page
const page = ref({
  size: 10,
  current: 1,
  sort: {
    column: 'time',
    direction: 'desc'
  },
  range: {
    start: null,
    end: null
  },
  total: 0
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.range.start, (val) => {
  if(!!val && !!page.value.range.end) return getList()
  if(!val && !page.value.range.end) return getList()
})
watch(() => page.value.range.end, (val) => {
  if(!!val && !!page.value.range.start) return getList()
  if(!val && !page.value.range.start) return getList()
})


// Loading
const loading = ref({
  load: true,
})

// Total
const listFormat = computed(() => {
  if(list.value.length == 0) return []

  const total = {
    time: 'ALL',
    count_total: 0,
    count_waiting: 0,
    count_refuse: 0,
    count_success: 0,
    money_total: 0,
    money_card: 0,
    money_bank: 0,
    money_momo: 0
  }

  list.value.forEach(i => {
    total.count_total = Number(total.count_total) + Number(i.count_total || 0)
    total.count_waiting = Number(total.count_waiting) + Number(i.count_waiting || 0)
    total.count_refuse = Number(total.count_refuse) + Number(i.count_refuse || 0)
    total.count_success = Number(total.count_success) + Number(i.count_success || 0)
    total.money_card = Number(total.money_card) + Number(i.money_card || 0)
    total.money_bank = Number(total.money_bank) + Number(i.money_bank || 0)
    total.money_momo = Number(total.money_momo) + Number(i.money_momo || 0)
    total.money_total = Number(total.money_total) + Number(i.money_total || 0)
  })

  let newList = []
  newList.push(total)
  
  newList = newList.concat(list.value)
  return newList
})
 
// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('statistic/payment', page.value)

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total

    const source = data.list.map(i => ({
      label: useDayJs().displayTime(i.time),
      value: i.money_total
    }))
    emits('update:modelValue', source)
  }
  catch (e) {
    loading.value.load = false
  } 
}

getList()
</script>
