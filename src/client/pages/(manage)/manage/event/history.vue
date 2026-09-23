<template>
  <UiContent :title="t('menuEventHistory')" :sub="t('menuEventHistoryInfo')">
    <UiFlex class="gap-1" wrap>
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]"/>

      <UForm :state="page" @submit="page.current = 1, getList()">
        <UInput size="sm" v-model="page.user" icon="i-bx-search" :placeholder="t('searchUser')" />
      </UForm>

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

        <template #server-data="{ row }">
          <UBadge variant="soft" color="gray">{{ row.server ? `${row.server}` : '...' }}</UBadge>
        </template>

        <template #role-data="{ row }">
          <UBadge variant="soft" color="gray">{{ row.role ? `${row.role}` : '...' }}</UBadge>
        </template>

        <template #[`event.type-data`]="{ row }">{{ (row.event && row.event.type) ? typeFormat[row.event.type] : '...' }}</template>

        <template #[`event.need-data`]="{ row }">
          <UiText weight="semibold">{{ (row.event && row.event.need) ? useMoney().toMoney(row.event.need) : '...' }}</UiText>
        </template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>

        <template #del-data="{ row }">
          <UButton color="gray" icon="i-bx-trash" :disabled="loading.del" @click="delAction(row._id)"/>
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
      <ManageUserInfo :user="stateUser" @close="modal.user = false"/>
    </UModal>
  </UiContent>
</template>

<script setup>
const { t } = useI18n()

// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'event.type',
    label: t('type'),
  },{
    key: 'event.need',
    label: t('need'),
  },{
    key: 'user',
    label: t('user'),
  },{
    key: 'server',
    label: t('server'),
  },{
    key: 'role',
    label: t('role'),
  },{
    key: 'createdAt',
    label: t('createdAt'),
    sortable: true
  },{
    key: 'del',
    label: t('del'),
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
  type: undefined,
  user: null,
  range: {
    start: null,
    end: null
  },
  total: 0,
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.type, () => getList())
watch(() => page.value.user, (val) => !val && getList())
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

// Type
const typeFormat = computed(() => ({
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
}))

const typeOptions = computed(() => [
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
])

// View User
const viewUser = (_id) => {
  modal.value.user = true
  stateUser.value = _id
}

// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('event/manage/history/list', page.value)

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

const delAction = async (_id) => {
  try {
    loading.value.del = true
    await useAPI('event/manage/history/del', { _id })

    loading.value.del = false
    getList()
  }
  catch (e) {
    loading.value.del = false
  }
}

getList()
</script>
