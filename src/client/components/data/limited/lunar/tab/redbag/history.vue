<template>
  <div>
    <UiFlex class="gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" class="lunar-box rounded-2xl mr-auto" />

      <SelectDate time v-model="page.range.start" :placeholder="t('start')" size="sm" class="lunar-box rounded-2xl" />
      <SelectDate time v-model="page.range.end" :placeholder="t('end')" size="sm" class="lunar-box rounded-2xl" />
    </UiFlex>

    <div class="lunar-box rounded-2xl my-2">
      <LoadingTable v-if="loading.load" />

      <UTable v-model:sort="page.sort" :columns="columns" :rows="list">
        <template #item-data="{ row }">
          <DataItem :item="row.item" :amount="row.amount" v-if="!!row.item" />
          <span v-else>...</span>
        </template>

        <template #server-data="{ row }">
          <UBadge color="gray" variant="soft">{{ row.server ? `${row.server}` : '...' }}</UBadge>
        </template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().fromTime(row.createdAt) }}
        </template>
      </UTable>
    </div>

    <UiFlex justify="end">
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="5" />
    </UiFlex>
  </div>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps(['user'])

const list = ref([])

const columns = [
  {
    key: 'item',
    label: t('award'),
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
  total: 0,
  range: {
    start: null,
    end: null
  },
  user: props.user || null,
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.range.start, (val) => {
  if(!!val && !!page.value.range.end) return (page.value.current != 1 ? page.value.current = 1 : getList())
  if(!val && !page.value.range.end) return (page.value.current != 1 ? page.value.current = 1 : getList())
})
watch(() => page.value.range.end, (val) => {
  if(!!val && !!page.value.range.start) return (page.value.current != 1 ? page.value.current = 1 : getList())
  if(!val && !page.value.range.start) return (page.value.current != 1 ? page.value.current = 1 : getList())
})

const loading = ref({
  load: true
})

const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI(`limited/lunar/public/redbag/history`, page.value)

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