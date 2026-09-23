<template>
  <UiContent :title="t('menuManagePayment')" :sub="t('menuManagePaymentInfo')">
    <UiFlex class="gap-1" wrap>
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" />

      <UiFlex class="gap-1 mr-auto">
        <UForm :state="page" @submit="page.current = 1, getList()" >
          <UInput v-model="page.user" :placeholder="t('searchUser')" icon="i-bx-search" size="sm" />
        </UForm>
        <UForm :state="page" @submit="page.current = 1, getList()" >
          <UInput v-model="page.code" :placeholder="t('searchCode')" icon="i-bx-search" size="sm" />
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
        <template #code-data="{ row }">
          <UiText weight="semibold" color="primary" pointer @click="viewPayment(row._id)">{{ row.code }}</UiText>
        </template>

        <template #user-data="{ row }">
          <span v-if="!row.user">...</span>
          <UBadge v-else variant="soft" color="gray" class="cursor-pointer" @click="viewUser(row.user._id)">
            {{ row.user.username }}
          </UBadge>
        </template>

        <template #gate-data="{ row }">
          <UBadge variant="soft" color="gray">
            {{ row.gate ? row.gate.name : '...' }}
          </UBadge>
        </template>

        <template #money-data="{ row }">
          <UiText weight="semibold">{{ toMoney(row.money) }}</UiText>
        </template>

        <template #status-data="{ row }">
          <UBadge :color="statusFormat[row.status].color" variant="soft">
            {{ statusFormat[row.status].label }}
          </UBadge>
        </template>

        <template #[`verify.person-data`]="{ row }">
          <UBadge v-if="!!row.verify && !!row.verify?.person" variant="soft" color="gray" class="cursor-pointer" @click="viewUser(row.verify.person._id)">
            {{ row.verify.person.username }}
          </UBadge>

          <span v-else>...</span>
        </template>

        <template #[`verify.time-data`]="{ row }">
          {{ !!row.verify && row.verify?.time ? useDayJs().displayFull(row.verify.time) : '...' }}
        </template>

        <template #auto-data="{ row }">
          <UiText weight="semibold" color="gray" v-if="!row.auto">Chưa nhận</UiText>
          <UiText weight="semibold" color="green" v-else>Đã nhận</UiText>
        </template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="actions(row)">
            <UButton color="gray" icon="i-bx-dots-horizontal-rounded"/>
          </UDropdown>
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

    <!-- Modal Payment View -->
    <UModal v-model="modal.payment">
      <UiContent :title="t('transaction')" :sub="t('transactionSub')" class="bg-card p-4 rounded-2xl">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.payment = false"></UButton>
        </template>

        <DataPaymentView :fetch-id="statePayment" :no-history="true" />
      </UiContent>
    </UModal>

    <!-- Modal Success -->
    <UModal v-model="modal.success" preventClose>
      <UForm :state="stateSuccess" @submit="successAction" class="bg-card rounded-2xl p-4">
        <UFormGroup :label="t('code')">
          <UInput :model-value="stateSuccess.code" readonly />
        </UFormGroup>

        <UFormGroup :label="t('moneyReal')">
          <UInput v-model="stateSuccess.money" type="number" />
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton type="submit" :loading="loading.success" color="green">{{ t('accept') }}</UButton>
          <UButton color="gray" @click="modal.success = false" :disabled="loading.success">{{ t('close') }}</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Refuse -->
    <UModal v-model="modal.refuse" preventClose>
      <UForm :state="stateRefuse" @submit="refuseAction" class="bg-card rounded-2xl p-4">
        <UFormGroup :label="t('code')">
          <UInput :model-value="stateRefuse.code" readonly />
        </UFormGroup>

        <UFormGroup :label="t('reason')">
          <UTextarea v-model="stateRefuse.reason" />
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton type="submit" :loading="loading.refuse" color="red">{{ t('refuse') }}</UButton>
          <UButton color="gray" @click="modal.refuse = false" :disabled="loading.refuse">{{ t('close') }}</UButton>
        </UiFlex>
      </UForm>
    </UModal>
  </UiContent>
</template>

<script setup>
const { t } = useI18n()
const authStore = useAuthStore()
const { toMoney } = useMoney()

// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'code',
    label: t('code'),
  },{
    key: 'user',
    label: t('guest'),
  },{
    key: 'gate',
    label: t('gate'),
  },{
    key: 'money',
    label: t('moneyAmount'),
    sortable: true
  },{
    key: 'status',
    label: t('status'),
    sortable: true
  },{
    key: 'verify.person',
    label: t('acceptUser'),
  },{
    key: 'verify.time',
    label: t('acceptDay'),
    sortable: true
  },{
    key: 'auto',
    label: t('auto'),
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
  user: null,
  code: null,
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
watch(() => page.value.user, (val) => !val && getList())
watch(() => page.value.code, (val) => !val && getList())
watch(() => page.value.range.start, (val) => {
  if(!!val && !!page.value.range.end) return (page.value.current != 1 ? page.value.current = 1 : getList())
  if(!val && !page.value.range.end) return (page.value.current != 1 ? page.value.current = 1 : getList())
})
watch(() => page.value.range.end, (val) => {
  if(!!val && !!page.value.range.start) return (page.value.current != 1 ? page.value.current = 1 : getList())
  if(!val && !page.value.range.start) return (page.value.current != 1 ? page.value.current = 1 : getList())
})

// State
const stateSuccess = ref({
  _id: null,
  code: null,
  money: null,
  status: null
})
const stateRefuse = ref({
  _id: null,
  code: null,
  money: null,
  reason: null,
  status: null
})
const stateWaiting = ref({
  _id: null,
  redo: true
})
const stateUser = ref(undefined)
const statePayment = ref(undefined)

// Modal
const modal = ref({
  success: false,
  refuse: false,
  waiting: false,
  user: false,
  payment: false
})

// Loading
const loading = ref({
  load: true,
  success: false,
  refuse: false,
  waiting: false,
})

// Status
const statusFormat = {
  0: { label: t('statusPending'), color: 'orange' },
  1: { label: t('statusSuccess'), color: 'green' },
  2: { label: t('statusError'), color: 'red' },
}

// Actions
const actions = (row) => [
  [{
    label: t('autoVerify'),
    icon: 'i-material-symbols-webhook',
    disabled: row.status > 0 || !row.channel || (!!row.channel && !row.channel?.id),
    click: () => checkAction(row._id)
  }],
  [{
    label: t('accept'),
    icon: 'i-bx-check',
    disabled: row.status > 0 || (!!row.channel && !!row.channel?.id),
    click: () => {
      Object.keys(stateSuccess.value).forEach(key => stateSuccess.value[key] = row[key])
      stateSuccess.value.status = 1
      modal.value.success = true
    }
  },{
    label: t('refuse'),
    icon: 'i-bx-x',
    disabled: row.status > 0 || (!!row.channel && !!row.channel?.id),
    click: () => {
      Object.keys(stateRefuse.value).forEach(key => stateRefuse.value[key] = row[key])
      stateRefuse.value.status = 2
      modal.value.refuse = true
    }
  }],[{
    label: t('undo'),
    icon: 'i-bx-redo',
    disabled: row.status == 0 || authStore.profile.type < 2,
    click: () => {
      stateWaiting.value._id = row._id
      waitingAction()
    }
  }]
]

const viewUser = (_id) => {
  stateUser.value = _id
  modal.value.user = true
}

const viewPayment = (_id) => {
  statePayment.value = _id
  modal.value.payment = true
}
 
// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('payment/manage/list', page.value)

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

const successAction = async () => {
  try {
    loading.value.success = true
    await useAPI('payment/manage/verify', stateSuccess.value)

    loading.value.success = false
    modal.value.success = false
    getList()
  }
  catch (e) {
    loading.value.success = false
  }
}

const refuseAction = async () => {
  try {
    loading.value.refuse = true
    await useAPI('payment/manage/verify', stateRefuse.value)

    loading.value.refuse = false
    modal.value.refuse = false
    getList()
  }
  catch (e) {
    loading.value.refuse = false
  }
}

const waitingAction = async () => {
  try {
    loading.value.waiting = true
    await useAPI('payment/manage/verify', stateWaiting.value)

    loading.value.waiting = false
    modal.value.waiting = false
    getList()
  }
  catch (e) {
    loading.value.waiting = false
  }
}

const checkAction = async (_id) => {
  try {
    await useAPI('payment/manage/hook', { _id: _id })
  }
  catch (e) {
    return false
  }
}

getList()
</script>
