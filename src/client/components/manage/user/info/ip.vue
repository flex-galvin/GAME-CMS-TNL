<template>
  <div>
    <UCard class="mb-2" :ui="{ 
      body: { padding: 'p-0 sm:p-0' },
      header: { padding: 'p-2 sm:p-2' },
      footer: { padding: 'p-2 sm:p-2' },
    }">
      <LoadingTable v-if="loading.load" />

      <UTable v-model:sort="page.sort" :columns="columns" :rows="list">
        <template #ip-data="{ row }">
          <UiText weight="semibold">{{ row.ip }}</UiText>
        </template>

        <template #block-data="{ row }">
          <UBadge :color="!!row.block ? 'red' : 'gray'">{{ !!row.block ? t('yes') : t('no') }}</UBadge>
        </template>

        <template #action-data="{ row }">
          <UButton v-if="!row.block" color="gray" size="xs" icon="i-bxs-lock-alt" @click="block(row.ip, 'block')" :loading="loading.block" />
          <UButton v-if="!!row.block" color="gray" size="xs" icon="i-bxs-lock-open-alt" @click="block(row.ip, 'unblock')" :loading="loading.block" />
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
const props = defineProps(['user'])

const loading = ref({
  load: true,
  block: false
})

const modal = ref({
})

const list = ref([])

const columns = [
  {
    key: 'ip',
    label: t('ip')
  },
  {
    key: 'block',
    label: t('block')
  },
  {
    key: 'action',
    label: t('action')
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
  user: props.user
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())

const block = async (ip, action) => {
  try {
    loading.value.true = true
    await useAPI('ip/user/block', { ip, action })

    loading.value.true = false
    getList()
  }
  catch (e) {
    loading.value.block = false
  }
}

const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('ip/user/view', page.value)

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