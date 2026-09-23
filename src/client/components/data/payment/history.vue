<template>
  <div>
    <UiFlex class="gap-1" wrap>
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" />

      <UForm @submit="page.current = 1, getList()" class="max-w-[9rem] mr-auto">
        <UInput v-model="page.search.key" :placeholder="t('search')" icon="i-bx-search" size="sm"></UInput>
      </UForm>
      
      <UiFlex class="gap-1">
        <SelectDate time v-model="page.range.start" :placeholder="t('start')" size="sm" />
        <SelectDate time v-model="page.range.end" :placeholder="t('end')" size="sm" />
      </UiFlex>
    </UiFlex>

    <UCard :ui="{ body: { padding: 'p-0 sm:p-0'}}" class="my-2">
      <LoadingTable v-if="loading.load" />

      <UTable v-model:sort="page.sort" :columns="columns" :rows="list">
        <template #code-data="{ row }">
          <UBadge variant="soft" color="primary" class="cursor-pointer" @click="viewPayment(row._id)">{{ row.code }}</UBadge>
        </template>

        <template #gate-data="{ row }">
          <UBadge variant="soft" color="gray">{{ row.gate.name }}</UBadge>
        </template>

        <template #money-data="{ row }">
          <UiText weight="semibold">{{ toMoney(row.money) }}</UiText>
        </template>

        <template #status-data="{ row }">
          <UBadge :color="statusFormat[row.status].color" variant="soft">
            {{ statusFormat[row.status].label }}
          </UBadge>
        </template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>

        <template #undo-data="{ row }">
          <UButton color="gray" size="xs" :disabled="row.status > 0" @click="openUndo(row)">{{ row.status > 0 ? '...' : t('cancel') }}</UButton>
        </template>
      </UTable>
    </UCard>

    <UiFlex justify="between">
      <UButton color="gray" icon="i-bx-check" v-if="totalSuccess != 0">{{ toMoney(totalSuccess) }}</UButton>
      <UPagination class="ml-auto" v-model="page.current" :page-count="page.size" :total="page.total" :max="5" />
    </UiFlex>

    <!-- Modal View -->
    <UModal v-model="modal.payment" prevent-close :ui="{width: 'sm:max-w-[370px]'}">
      <UiContent :title="t('transaction')" :sub="t('transactionSub')" class="bg-card p-4 rounded-2xl">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.payment = false"></UButton>
        </template>

        <DataPaymentView :fetch-id="statePayment" :no-history="true" />
      </UiContent>
    </UModal>

    <!-- Modal Undo -->
    <UModal v-model="modal.undo" prevent-close>
      <UiContent :title="t('transactionCancel')" :sub="t('transactionCancelInfo')" class="bg-card rounded-2xl p-4">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.undo = false"></UButton>
        </template>

        <UForm @submit="undoAction" >
          <UFormGroup :label="t('code')">
            <UInput :model-value="stateUndo.code" readonly />
          </UFormGroup>

          <UFormGroup :label="t('reason')">
            <UTextarea v-model="stateUndo.reason" />
          </UFormGroup>

          <UiFlex justify="end">
            <UButton type="submit" :loading="loading.undo" color="rose">{{ t('confirm') }}</UButton>
            <UButton color="gray" @click="modal.undo = false" :disabled="loading.undo" class="ml-1">{{ t('close') }}</UButton>
          </UiFlex>
        </UForm>
      </UiContent>
    </UModal>
  </div>
</template>

<script setup>
const { t } = useI18n()

const props = defineProps(['user', 'reload'])

const { toMoney } = useMoney()

const loading = ref({
  load: true,
  undo: false
})

const modal = ref({
  undo: false,
  payment: false
})

const list = ref([])

const columns = [
  {
    key: 'code',
    label: t('code'),
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
    key: 'createdAt',
    label: t('createdAt'),
    sortable: true
  },{
    key: 'undo',
  }
]

const page = ref({
  size: 5,
  current: 1,
  sort: {
    column: 'createdAt',
    direction: 'desc'
  },
  search: {
    key: null,
    by: 'code'
  },
  range: {
    start: null,
    end: null
  },
  total: 0,
  user: props.user || null
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.search.key, (val) => !val && getList())
watch(() => page.value.range.start, (val) => {
  if(!!val && !!page.value.range.end) return getList()
  if(!val && !page.value.range.end) return getList()
})
watch(() => page.value.range.end, (val) => {
  if(!!val && !!page.value.range.start) return getList()
  if(!val && !page.value.range.start) return getList()
})
watch(() => props.reload, () => getList())

const statusFormat = {
  0: { label: t('statusPending'), color: 'orange' },
  1: { label: t('statusSuccess'), color: 'green' },
  2: { label: t('statusError'), color: 'red' },
  3: { label: t('statusUndo'), color: 'blue' },
}

const stateUndo = ref({
  _id: null,
  code: null,
  reason: null
})
const statePayment = ref(undefined)

const openUndo = (row) => {
  stateUndo.value._id = row._id
  stateUndo.value.code = row.code
  modal.value.undo = true
}

const viewPayment = (_id) => {
  statePayment.value = _id
  modal.value.payment = true
}

const undoAction = async () => {
  try {
    loading.value.undo = true
    await useAPI('payment/public/undo', stateUndo.value)

    loading.value.undo = false
    modal.value.undo = false
    getList()
  }
  catch (e) {
    loading.value.undo = false
  }
}

// Total
const totalSuccess = computed(() => {
  if(list.value.length == 0) return 0

  let m = 0
  list.value.forEach(i => {
    if(i.status == 1) m = Number(m) + Number(i.money)
  })

  return m
})

const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('payment/public/history', page.value)

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

onMounted(() => setTimeout(getList, 1))
</script>