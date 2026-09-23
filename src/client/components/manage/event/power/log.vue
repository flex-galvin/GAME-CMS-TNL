<template>
  <div>
    <UCard class="mb-2" :ui="{ body: { padding: 'p-0 sm:p-0' }}">
      <LoadingTable v-if="loading.load" />

      <UTable v-model:sort="page.sort" :columns="columns" :rows="list">
        <template #content-data="{ row }">
          <div class="whitespace-normal" v-html="row.content" />
        </template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>
      </UTable>
    </UCard>

    <UiFlex justify="between">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="5" />
    </UiFlex>
  </div>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps(['fetchId'])

const loading = ref({
  load: true
})

const list = ref([])

const columns = [
  {
    key: 'content',
    label: t('content'),
  },
  {
    key: 'createdAt',
    label: t('time'),
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
  fetchID: props.fetchId,
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())

const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('event/manage/power/log', page.value)

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