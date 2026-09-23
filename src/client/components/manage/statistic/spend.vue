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
        :rows="list"
      >
        <template #time-data="{ row }">
          <UiText color="primary" weight="semibold">{{row.timeformat}} {{ useDayJs().displayTime(row.time) }}</UiText>
        </template>

        <template #money-data="{ row }">
          {{  useMoney().toMoney(row.money) }}
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
    key: 'money',
    label: t('moneyAmount'),
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
 
// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('statistic/spend', page.value)

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total

    const source = data.list.map(i => ({
      label: useDayJs().displayTime(i.time),
      value: i.money
    }))
    emits('update:modelValue', source)
  }
  catch (e) {
    loading.value.load = false
  } 
}

getList()
</script>
