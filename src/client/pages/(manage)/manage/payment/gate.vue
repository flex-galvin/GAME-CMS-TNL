<template>
  <UiContent :title="t('menuManageGate')" :sub="t('menuManageGateInfo')">
    <UiFlex class="gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" class="mr-auto"/>
      <UButton color="yellow" icon="i-bx-plus" @click="modal.add = true">{{ t('add') }}</UButton>
    </UiFlex>

    <!-- Table -->
    <UCard class="my-2" :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns" 
        :rows="list"
      >
        <template #type-data="{ row }">
          <UBadge variant="soft">{{ typeFormat[row.type] }}</UBadge>
        </template>

        <template #payment_money-data="{ row }">
          <UiText weight="semibold">{{ toMoney(row.payment_money) }}</UiText>
        </template>

        <template #bonus_default-data="{ row }">
          {{ row.bonus_default }}%
        </template>

        <template #bonus_limit-data="{ row }">
          {{ row.bonus_limit }}% 
          <span v-if="!!row.bonus_limit_expire">{{ `${t('toDate')} ${useDayJs().displayFull(row.bonus_limit_expired)}` }}</span>
        </template>

        <template #display-data="{ row }">
          <UBadge :color="row.display == 1 ? 'green' : 'gray'" variant="soft">{{ row.display == 1 ? t('show') : t('hide') }}</UBadge>
        </template>

        <template #updatedAt-data="{ row }">
          {{ useDayJs().displayFull(row.updatedAt) }}
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="actions(row)">
            <UButton color="gray" icon="i-bx-dots-horizontal-rounded" :disabled="loading.del"/>
          </UDropdown>
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between">
      <USelectMenu v-model="selectedColumns" :options="columns" multiple :placeholder="t('selectColumns')" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="4" />
    </UiFlex>

    <!-- Modal Add -->
    <UModal v-model="modal.add" preventClose>
      <UForm :state="stateAdd" @submit="addAction" class="bg-card rounded-2xl p-4">
        <UFormGroup :label="t('type')">
          <SelectGateType v-model="stateAdd.type" />
        </UFormGroup>
        
        <UFormGroup :label="t('name')">
          <UInput v-model="stateAdd.name" />
        </UFormGroup>

        <UFormGroup :label="t('gateBankNumber')">
          <UInput v-model="stateAdd.number" />
        </UFormGroup>

        <UFormGroup :label="t('gateBankPerson')">
          <UInput v-model="stateAdd.person" />
        </UFormGroup>

        <UFormGroup :label="t('type')">
          <SelectDisplay v-model="stateAdd.display" />
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton color="yellow" type="submit" :loading="loading.add">{{ t('add') }}</UButton>
          <UButton color="gray" @click="modal.add = false" :disabled="loading.add">{{ t('close') }}</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit -->
    <UModal v-model="modal.edit" preventClose>
      <UForm :state="stateEdit" @submit="editAction" class="bg-card rounded-2xl p-4">
        <UFormGroup :label="t('name')">
          <UInput v-model="stateEdit.name" />
        </UFormGroup>

        <UFormGroup :label="t('gateBankNumber')">
          <UInput v-model="stateEdit.number" />
        </UFormGroup>

        <UFormGroup :label="t('gateBankPerson')">
          <UInput v-model="stateEdit.person" />
        </UFormGroup>

        <UFormGroup :label="t('type')">
          <SelectDisplay v-model="stateEdit.display" />
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton color="yellow" type="submit" :loading="loading.edit">{{ t('edit') }}</UButton>
          <UButton color="gray" @click="modal.edit = false" :disabled="loading.edit">{{ t('close') }}</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Promo -->
    <UModal v-model="modal.promo" preventClose>
      <UForm :state="statePromo" @submit="promoAction" class="bg-card rounded-2xl p-4">
        <UFormGroup :label="t('promoDefault')">
          <UInput v-model="statePromo.bonus.default" type="number" />
        </UFormGroup>

        <UFormGroup :label="t('promoLimited')">
          <UiFlex class="gap-1">
            <UInput v-model="statePromo.bonus.limit.number" type="number" :placeholder="t('percent')" class="w-full" />
            <SelectDate v-model="statePromo.bonus.limit.expired" time :placeholder="t('expired')" class="w-full" />
          </UiFlex>
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton color="yellow" type="submit" :loading="loading.promo">{{ t('save') }}</UButton>
          <UButton color="gray" @click="modal.promo = false" :disabled="loading.promo">{{ t('close') }}</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Extend -->
    <UModal v-model="modal.extend" preventClose>
      <UForm :state="stateExtend" @submit="extendAction" class="bg-card rounded-2xl p-4">
        <UFormGroup label="Dynamic">
          <template #hint>
            <UToggle v-model="stateExtend.dynamic.enable" />
          </template>
        </UFormGroup>

        <div v-if="!!stateExtend.dynamic.enable">
          <UFormGroup label="API URL">
            <UInput v-model="stateExtend.dynamic.api" />
          </UFormGroup>

          <UFormGroup label="Sign Key" >
            <UInput v-model="stateExtend.dynamic.sign" />
          </UFormGroup>

          <UFormGroup label="API Callback Key" >
            <UInput v-model="stateExtend.dynamic.key" />
          </UFormGroup>

          <UFormGroup label="API URL Check Payment" >
            <UInput v-model="stateExtend.dynamic.check" />
          </UFormGroup>
        </div>

        <div v-if="!stateExtend.dynamic || (!!stateExtend.dynamic && !stateExtend.dynamic.enable)">
          <UFormGroup label="Key">
            <UInput v-model="stateExtend.key" />
          </UFormGroup>

          <UFormGroup label="QR Code" >
            <UInput v-model="stateExtend.qrcode" />
          </UFormGroup>
        </div>

        <UiFlex justify="end" class="gap-1">
          <UButton color="yellow" type="submit" :loading="loading.extend">{{ t('save') }}</UButton>
          <UButton color="gray" @click="modal.extend = false" :disabled="loading.extend">{{ t('close') }}</UButton>
        </UiFlex>
      </UForm>
    </UModal>
  </UiContent>
</template>

<script setup>
import { UiFlex } from '#components'

const { t } = useI18n()

const { toMoney } = useMoney()

// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'type',
    label: t('type'),
    sortable: true
  },{
    key: 'name',
    label: t('name'),
  },{
    key: 'payment_count',
    label: t('transaction'),
  },{
    key: 'payment_money',
    label: t('moneyAmount'),
  },{
    key: 'bonus_default',
    label: t('promoDefault'),
    sortable: true
  },{
    key: 'bonus_limit',
    label: t('promoLimited'),
    sortable: true
  },{
    key: 'display',
    label: t('display'),
    sortable: true
  },{
    key: 'updatedAt',
    label: t('updatedAt'),
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
    column: 'payment_money',
    direction: 'desc'
  },
  total: 0
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())

// State
const stateAdd = ref({
  type: null,
  name: null,
  person: null,
  number: null,
  display: 1,
})

const stateEdit = ref({
  _id: null,
  name: null,
  person: null,
  number: null,
  display: 1,
})

const statePromo = ref({
  _id: null,
  bonus: null,
})

const stateExtend = ref({
  _id: null,
  qrcode: null,
  key: null,
  dynamic: {
    enable: false,
    api: null,
    sign: null,
    key: null,
    check: null
  }
})

// Modal
const modal = ref({
  add: false,
  edit: false,
  extend: false,
  promo: false
})

watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
  type: null,
  name: null,
  person: null,
  number: null,
  display: 1,
}))

// Loading
const loading = ref({
  load: true,
  add: false,
  edit: false,
  extend: false,
  promo: false,
  del: false
})

// Type
const typeFormat = computed(() => ({
  1: t('gateCard'),
  2: t('gateBank'),
  3: t('gateMomo')
}))

// Actions
const actions = (row) => [
  [{
    label: t('editInfo'),
    icon: 'i-bx-pencil',
    click: () => {
      Object.keys(stateEdit.value).forEach(key => stateEdit.value[key] = row[key])
      modal.value.edit = true
    }
  },{
    label: t('editPromo'),
    icon: 'i-bx-gift',
    click: () => {
      Object.keys(statePromo.value).forEach(key => statePromo.value[key] = row[key])
      modal.value.promo = true
    }
  },{
    label: t('editExtend'),
    icon: 'i-bx-qr',
    click: () => {
      Object.keys(stateExtend.value).forEach(key => stateExtend.value[key] = row[key])
      if(!stateExtend.value.dynamic) stateExtend.value.dynamic = { enable: false, api: '', sign: '', key: '', check: '' }
      modal.value.extend = true
    }
  }],[{
    label: t('delData'),
    icon: 'i-bx-trash',
    click: () => delAction(row._id)
  }]
]
 
// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('gate/manage/list', page.value)

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

const addAction = async () => {
  try {
    loading.value.add = true
    await useAPI('gate/manage/add', stateAdd.value)

    loading.value.add = false
    modal.value.add = false
    getList()
  }
  catch (e) {
    loading.value.add = false
  }
}

const editAction = async () => {
  try {
    loading.value.edit = true
    await useAPI('gate/manage/edit', stateEdit.value)

    loading.value.edit = false
    modal.value.edit = false
    getList()
  }
  catch (e) {
    loading.value.edit = false
  }
}

const extendAction = async () => {
  try {
    loading.value.extend = true
    await useAPI('gate/manage/extend', stateExtend.value)

    loading.value.extend = false
    modal.value.extend = false
    getList()
  }
  catch (e) {
    loading.value.extend = false
  }
}

const promoAction = async () => {
  try {
    loading.value.promo = true
    await useAPI('gate/manage/promo', statePromo.value)

    loading.value.promo = false
    modal.value.promo = false
    getList()
  }
  catch (e) {
    loading.value.promo = false
  }
}

const delAction = async (_id) => {
  try {
    loading.value.del = true
    await useAPI('gate/manage/del', { _id })

    loading.value.del = false
    getList()
  }
  catch (e) {
    loading.value.del = false
  }
}

getList()
</script>
