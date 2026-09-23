<template>
  <UiContent :title="t('menuManageUser')" :sub="t('menuManageUserInfo')">
    <UiFlex class="gap-1" wrap>
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]"/>

      <UForm :state="page" @submit="page.current = 1, getList()" class="mr-auto">
        <UiFlex class="gap-1">
          <UInput v-model="page.search.key" :placeholder="t('search')" icon="i-bx-search" size="sm" />
          <USelectMenu v-model="page.search.by" :options="['USER', 'PHONE', 'MAIL', 'IP']" />
        </UiFlex>
      </UForm>

      <UiFlex class="gap-1">
        <UButton color="green" icon="i-healthicons-excel-logo" :loading="loading.export" @click="exportExcel">{{ t('export') }}</UButton>

        <UDropdown :items="actionsReset()">
          <UButton color="orange" icon="i-bx-reset" :loading="loading.reset">{{ t('reset') }}</UButton>
        </UDropdown>

        <UButton color="rose" icon="i-mi-delete" :loading="loading.del" @click="modal.del = true">{{ t('del') }}</UButton>
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
        <template #username-data="{ row }">
          <UBadge variant="soft" color="gray" class="cursor-pointer" @click="viewUser(row._id)">
            {{ row.username }}
          </UBadge>
        </template>

        <template #level-data="{ row }">
          <UBadge color="primary" variant="soft">{{ row.level ? `${t('level')} ${row.level.number || 0}` : `...` }}</UBadge>
        </template>
        
        <template #[`pay.total.money-data`]="{ row }">
          {{ toMoney(row.pay.total.money || 0) }}
        </template>

        <template #[`spend.total.coin-data`]="{ row }">
          {{ toMoney(row.spend.total.coin || 0) }}
        </template>

        <template #[`currency.coin-data`]="{ row }">
          {{ toMoney(row.currency.coin || 0) }}
        </template>

        <template #[`diamond.coin-data`]="{ row }">
          {{ toMoney(row.currency.diamond || 0) }}
        </template>

        <template #[`login.total-data`]="{ row }">
          {{ `${row.login.total || 0}` }}
        </template>

        <template #block-data="{ row }">
          <UBadge :color="row.block == 1 ? 'red' : 'gray'" variant="soft">{{ row.block == 1 ? t('yes') : t('no') }}</UBadge>
        </template>

        <template #type-data="{ row }">
          <UBadge :color="typeFormat[row.type].color" variant="soft">
            {{ typeFormat[row.type].label }}
          </UBadge>
        </template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>

        <template #actions-data="{ row }">
          <UiFlex class="gap-1">
            <ManageUserAction :user="row" @done="getList" />
            <ManageUserReset :user="row" @done="getList" />
          </UiFlex>
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between">
      <USelectMenu v-model="selectedColumns" :options="columns" multiple :placeholder="t('selectColumns')" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
    </UiFlex>

    <!-- Modal User View -->
    <UModal v-model="modal.user" :ui="{width: 'sm:max-w-[900px]'}">
      <ManageUserInfo :user="stateUser" @close="modal.user = false" />
    </UModal>

    <!-- Modal Del-->
    <UModal v-model="modal.del" preventClose>
      <UiContent :title="t('manageUserDel')" :sub="t('manageUserDelInfo')" class="bg-card rounded-2xl p-4">
        <UForm :state="stateDel" @submit="delAction" >
          <UFormGroup :label="t('manageUserDelInfoDay')" :help="t('manageUserDelInfoPayment')">
            <UInput v-model="stateDel.day" type="number" />
          </UFormGroup>

          <UiFlex justify="end" class="gap-1">
            <UButton color="rose" type="submit" :loading="loading.del">{{ t('confirm') }}</UButton>
            <UButton color="gray" @click="modal.del = false" :disabled="loading.del">{{ t('close') }}</UButton>
          </UiFlex>
        </UForm>
      </UiContent>
    </UModal>
  </UiContent>
</template>

<script setup>
const { t } = useI18n()

const { toMoney } = useMoney()

// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'username',
    label: t('name'),
  },{
    key: 'level',
    label: t('level'),
  },{
    key: 'pay.total.money',
    label: t('payment'),
    sortable: true
  },{
    key: 'spend.total.coin',
    label: t('spend'),
    sortable: true
  },{
    key: 'currency.coin',
    label: t('coin'),
    sortable: true
  },{
    key: 'currency.diamond',
    label: t('diamond'),
    sortable: true
  },{
    key: 'login.total',
    label: t('login'),
    sortable: true
  },{
    key: 'referral.count',
    label: t('friend'),
    sortable: true
  },{
    key: 'block',
    label: t('block'),
    sortable: true
  },{
    key: 'type',
    label: t('userService'),
    sortable: true
  },{
    key: 'createdAt',
    label: t('createdAt'),
    sortable: true
  },{
    key: 'actions',
    label: t('action'),
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
  search: {
    key: null,
    by: 'USER'
  },
  total: 0
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.search.key, (val) => !val && getList())

// State
const stateUser = ref(undefined)
const stateDel = ref({ day: 30 })

// Modal
const modal = ref({
  user: false,
  del: false
})

// Loading
const loading = ref({
  load: true,
  export: false,
  del: false,
  reset: false
})

// Type
const typeFormat = {
  0: { label: 'MEMBER', color: 'gray' },
  1: { label: 'SMOD', color: 'green' },
  2: { label: 'DEV', color: 'cyan' },
  3: { label: 'ADMIN', color: 'red' },
  99: { label: 'ROBOT', color: 'orange' }
}

// Action Reset All
const actionsReset = () => [
  [{ label: t('resetCurrency'), click: () => resetAction('currency', null)}],
  [
    { label: t('resetPayDay'), click: () => resetAction('pay.day', null)},
    { label: t('resetPayMonth'), click: () => resetAction('pay.month', null)},
    { label: t('resetPayTotal'), click: () => resetAction('pay.total', null)},
  ],
  [
    { label: t('resetPaymusty'), click: () => resetAction('paymusty', null)},
    { label: t('resetPaydays'), click: () => resetAction('paydays', null)},
  ],
  [
    { label: t('resetSpendDay'), click: () => resetAction('spend.day', null)},
    { label: t('resetSpendMonth'), click: () => resetAction('spend.month', null)},
    { label: t('resetSpendTotal'), click: () => resetAction('spend.total', null)},
  ],
  [
    { label: t('resetLoginMonth'), click: () => resetAction('login.month', null)},
    { label: t('resetLoginTotal'), click: () => resetAction('login.total', null)},
  ],
  [ { label: t('resetEgg'), click: () => resetAction('egg', null)},
]]

const viewUser = (_id) => {
  stateUser.value = _id
  modal.value.user = true
}
 
// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('user/manage/list', page.value)

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

const delAction = async () => {
  try {
    loading.value.del = true
    await useAPI('user/manage/del', stateDel.value)

    loading.value.del = false
    modal.value.del = false
    getList()
  }
  catch (e) {
    loading.value.del = false
  }
}

const resetAction = async (type) => {
  try {
    loading.value.reset = true
    await useAPI('user/manage/reset', { type })

    loading.value.reset = false
    getList()
  }
  catch (e) {
    loading.value.reset = false
  }
}

const exportExcel = async () => {
  try {
    loading.value.export = true
    const url = await useAPI('user/manage/excel')

    window.open(url, '_blank')
    loading.value.export = false
  }
  catch (e) {
    loading.value.export = false
  }
}


getList()
</script>
