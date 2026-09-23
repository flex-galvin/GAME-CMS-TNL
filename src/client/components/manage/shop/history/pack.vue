<template>
  <div>
    <UiFlex class="gap-1" wrap>
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]"/>

      <SelectGameServer v-model="page.server_id" size="sm" />

      <UiFlex class="mr-auto gap-1">
        <UForm :state="page" @submit="page.current = 1, getList()">
          <UInput size="sm" v-model="page.user" :placeholder="t('searchUser')" icon="i-bx-search" />
        </UForm>

        <UForm :state="page" @submit="page.current = 1, getList()">
          <UInput size="sm" v-model="page.item" :placeholder="t('searchItem')" icon="i-bx-search" />
        </UForm>
      </UiFlex>

      <UiFlex class="gap-1">
        <SelectDate time v-model="page.range.start" :placeholder="t('start')" size="sm" />
        <SelectDate time v-model="page.range.end" :placeholder="t('end')" size="sm" />
      </UiFlex>
    </UiFlex>
    
    <!-- Table -->
    <UCard class="my-2" :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns"
        :rows="list"
      >
        <template #user-data="{ row }">
          <UButton size="2xs" color="gray" @click="viewUser(row.user._id)">{{ row.user.username }}</UButton>
        </template>

        <template #pack-data="{ row }">
          <UiText weight="semibold">{{ row.pack ? `${row.pack.name}` : '...' }}</UiText>
        </template>

        <template #amount-data="{ row }">
          <UiText weight="semibold">{{ toMoney(row.amount) }}</UiText>
        </template>

        <template #server-data="{ row }">
          <UBadge variant="soft" color="gray">{{ row.server ? `${row.server}` : '...' }}</UBadge>
        </template>

        <template #role-data="{ row }">
          <UBadge variant="soft" color="gray">{{ row.role ? `${row.role}` : '...' }}</UBadge>
        </template>

        <template #price-data="{ row }">
          <UiText weight="semibold">{{ toMoney(row.price) }}</UiText>
        </template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between">
      <USelectMenu v-model="selectedColumns" :options="columns" multiple :placeholder="t('selectColumns')" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
    </UiFlex>

    <!--Modal User Info-->
    <UModal v-model="modal.user" :ui="{width: 'sm:max-w-[900px]'}">
      <ManageUserInfo :user="stateUser" @close="modal.user = false" />
    </UModal>
  </div>
</template>

<script setup>
const { t } = useI18n()
const { toMoney } = useMoney()

// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'user',
    label: t('user'),
  },{
    key: 'pack',
    label: t('pack'),
  },{
    key: 'amount',
    label: t('amount'),
    sortable: true
  },{
    key: 'server',
    label: t('server'),
  },{
    key: 'role',
    label: t('role'),
  },{
    key: 'price',
    label: t('price'),
    sortable: true
  },{
    key: 'createdAt',
    label: t('createdAt'),
    sortable: true
  }
]
const selectedColumns = ref([...columns])

// Page
const page = ref({
  size: 10,
  current: 1,
  sort: {
    column: 'createdAt',
    direction: 'desc'
  },
  range: {
    start: null,
    end: null
  },
  user: null,
  item: null,
  server_id: null,
  total: 0,
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.user, (val) => !val && getList())
watch(() => page.value.item, (val) => !val && getList())
watch(() => page.value.server_id, () => getList())
watch(() => page.value.range.start, (val) => {
  if(!!val && !!page.value.range.end) return (page.value.current != 1 ? page.value.current = 1 : getList())
  if(!val && !page.value.range.end) return (page.value.current != 1 ? page.value.current = 1 : getList())
})
watch(() => page.value.range.end, (val) => {
  if(!!val && !!page.value.range.start) return (page.value.current != 1 ? page.value.current = 1 : getList())
  if(!val && !page.value.range.start) return (page.value.current != 1 ? page.value.current = 1 : getList())
})

// State
const stateUser = ref(undefined)

// Modal
const modal = ref({
  user: false
})

// Loading
const loading = ref({
  load: true
})

// View User
const viewUser = (_id) => {
  modal.value.user = true
  stateUser.value = _id
}

// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('shop/pack/manage/history', page.value)

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
