<template>
  <div>
    <UiFlex class="gap-1" wrap>
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" />

      <USelectMenu 
        v-model="page.type" 
        value-attribute="value"
        option-attribute="label"
        :options="typeOptions"
        class="mr-auto"
      >
        <template #label>{{ page.type ? typeFormat[page.type] : t('eventAll') }}</template>
      </USelectMenu>

      <UiFlex class="gap-1">
        <SelectDate time v-model="page.range.start" :placeholder="t('start')" size="sm" />
        <SelectDate time v-model="page.range.end" :placeholder="t('end')" size="sm" />
      </UiFlex>
    </UiFlex>

    <UCard class="my-2" :ui="{ body: { padding: 'p-0 sm:p-0' }}">
      <LoadingTable v-if="loading.load" />

      <UTable v-model:sort="page.sort" :columns="columns" :rows="list">
        <template #server-data="{ row }">
          <UBadge color="gray" variant="soft">{{ row.server ? `${row.server}` : '...' }}</UBadge>
        </template>

        <template #[`event.need-data`]="{ row }">
          <UBadge variant="soft">{{ (row.event && row.event.need) ? useMoney().toMoney(row.event.need) : '...' }}</UBadge>
        </template>

        <template #[`event.type-data`]="{ row }">{{ (row.event && row.event.type) ? typeFormat[row.event.type] : '...' }}</template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>
      </UTable>
    </UCard>

    <UiFlex justify="end">
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="5" />
    </UiFlex>
  </div>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps(['user'])

const loading = ref({
  load: true
})

const list = ref([])

const columns = [
  {
    key: 'event.type',
    label: t('type'),
  },{
    key: 'event.need',
    label: t('need'),
  },{
    key: 'server',
    label: t('server'),
  },{
    key: 'createdAt',
    label: t('createdAt'),
    sortable: true
  }
]

const page = ref({
  size: 5,
  current: 1,
  sort: {
    column: 'createdAt',
    direction: 'desc'
  },
  type: undefined,
  total: 0,
  range: {
    start: null,
    end: null
  },
  user: props.user || null
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.type, () => getList())
watch(() => page.value.range.start, (val) => {
  if(!!val && !!page.value.range.end) return (page.value.current != 1 ? page.value.current = 1 : getList())
  if(!val && !page.value.range.end) return (page.value.current != 1 ? page.value.current = 1 : getList())
})
watch(() => page.value.range.end, (val) => {
  if(!!val && !!page.value.range.start) return (page.value.current != 1 ? page.value.current = 1 : getList())
  if(!val && !page.value.range.start) return (page.value.current != 1 ? page.value.current = 1 : getList())
})

const typeFormat = {
  'login.month': t('eventLoginMonth'),
  'login.total': t('eventLoginTotal'),
  'pay.day.money': t('eventPayDay'),
  'pay.month.money': t('eventPayMonth'),
  'pay.total.money': t('eventPayTotal'),
  'spend.day.coin': t('eventSpendDay'),
  'spend.month.coin': t('eventSpendMonth'),
  'spend.total.coin': t('eventSpendTotal'),
  'referral.count': t('eventReferralTotal'),
  'paymusty': t('eventPaymusty'),
  'paydays': t('eventPaydays')
}

const typeOptions = [
  { label: t('eventAll'), value: undefined },
  { label: t('eventLoginMonth'), value: 'login.month' },
  { label: t('eventLoginTotal'), value: 'login.total' },
  { label: t('eventPayDay'), value: 'pay.day.money' },
  { label: t('eventPayMonth'), value: 'pay.month.money' },
  { label: t('eventPayTotal'), value: 'pay.total.money' },
  { label: t('eventSpendDay'), value: 'spend.day.coin' },
  { label: t('eventSpendMonth'), value: 'spend.month.coin' },
  { label: t('eventSpendTotal'), value: 'spend.total.coin' },
  { label: t('eventReferralTotal'), value: 'referral.count' },
  { label: t('eventPaymusty'), value: 'paymusty' },
  { label: t('eventPaydays'), value: 'paydays' },
]

const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('event/public/history', page.value)

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

getList()
</script>