<template>
  <UiContent :title="t('menuManageUserLevel')" :sub="t('menuManageUserLevelInfo')">
    <UiFlex class="gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" class="mr-auto"/>
    </UiFlex>
    
    <!-- Table -->
    <UCard class="my-2" :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns" 
        :rows="list"
      >
        <template #number-data="{ row }">
          <UBadge color="primary" variant="soft">{{ `${t('level')} ${row.number}` }}</UBadge>
        </template>

        <template #[`need.login-data`]="{ row }">
          <UiText color="primary">{{ useMoney().toMoney(row.need.login) }} {{ t('day') }}</UiText>
        </template>

        <template #[`need.pay.money-data`]="{ row }">
          <UiText color="primary">{{ useMoney().toMoney(row.need.pay.money) }}</UiText>
        </template>

        <template #[`need.spend.coin-data`]="{ row }">
          <UiText color="primary">{{ useMoney().toMoney(row.need.spend.coin) }}</UiText>
        </template>

        <template #bonus-data="{ row }">
          <UiText color="green">+{{ row.bonus }}%</UiText>
        </template>

        <template #bonus_wheel-data="{ row }">
          <UiText color="green">{{ useMoney().toMoney(row.bonus_wheel) }} / 1</UiText>
        </template>

        <template #discount-data="{ row }">
          <UiText color="rose">-{{ row.discount }}%</UiText>
        </template>

        <template #bonus_presentee_pay-data="{ row }">
          <UiText color="orange">+{{ row.bonus_presentee_pay }}%</UiText>
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

    <!-- Modal Edit Info -->
    <UModal v-model="modal.editInfo" preventClose>
      <UForm :state="stateEditInfo" @submit="editInfoAction" class="bg-card rounded-2xl p-4">
        <UFormGroup :label="t('levelTitle')">
          <UInput v-model="stateEditInfo.title"/>
        </UFormGroup>

        <UFormGroup :label="t('levelPaymentBonusCoin')">
          <UInput v-model="stateEditInfo.bonus" type="number" />
        </UFormGroup>

        <UFormGroup :label="t('levelPaymentBonusWheel')">
          <UInput v-model="stateEditInfo.bonus_wheel" type="number" />
        </UFormGroup>

        <UFormGroup :label="t('levelDiscountShop')">
          <UInput v-model="stateEditInfo.discount" type="number" />
        </UFormGroup>

        <UFormGroup :label="t('levelBonusFriendPayment')">
          <UInput v-model="stateEditInfo.bonus_presentee_pay" type="number" />
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton color="yellow" type="submit" :loading="loading.editInfo">{{ t('edit') }}</UButton>
          <UButton color="gray" @click="modal.editInfo = false" :disabled="loading.editInfo">{{ t('close') }}</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit Need -->
    <UModal v-model="modal.editNeed" preventClose>
      <UForm :state="stateEditNeed" @submit="editNeedAction" class="bg-card rounded-2xl p-4">
        <UFormGroup :label="t('login')">
          <UInput v-model="stateEditNeed.need.login" type="number" />
        </UFormGroup>

        <UFormGroup :label="t('payment')">
          <UInput v-model="stateEditNeed.need.pay.money" type="number" />
        </UFormGroup>

        <UFormGroup :label="t('spend')">
          <UInput v-model="stateEditNeed.need.spend.coin" type="number" />
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton color="yellow" type="submit" :loading="loading.editNeed">{{ t('edit') }}</UButton>
          <UButton color="gray" @click="modal.editNeed = false" :disabled="loading.editNeed">{{ t('close') }}</UButton>
        </UiFlex>
      </UForm>
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
    key: 'number',
    label: t('level'),
    sortable: true
  },{
    key: 'title',
    label: t('levelTitle'),
  },{
    key: 'need.login',
    label: t('needLogin'),
    sortable: true
  },{
    key: 'need.pay.money',
    label: t('needPay'),
    sortable: true
  },{
    key: 'need.spend.coin',
    label: t('needSpend'),
    sortable: true
  },{
    key: 'bonus',
    label: t('levelPaymentBonusCoin'),
    sortable: true
  },{
    key: 'bonus_wheel',
    label: t('levelPaymentBonusWheel'),
    sortable: true
  },{
    key: 'discount',
    label: t('levelDiscountShop'),
    sortable: true
  },{
    key: 'bonus_presentee_pay',
    label: t('levelBonusFriendPayment'),
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
    column: 'number',
    direction: 'asc'
  },
  total: 0
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())

// State
const stateEditInfo = ref({
  _id: null,
  title: null,
  bonus: null,
  bonus_wheel: null,
  bonus_presentee_pay: null,
  discount: null
})

const stateEditNeed = ref({
  _id: null,
  need: null
})

// Modal
const modal = ref({
  editInfo: false,
  editNeed: false
})

// Loading
const loading = ref({
  load: true,
  editInfo: false,
  editNeed: false,
  del: false
})

// Actions
const actions = (row) => [
  [{
    label: t('editInfo'),
    icon: 'i-bx-pencil',
    click: () => {
      Object.keys(stateEditInfo.value).forEach(key => stateEditInfo.value[key] = row[key])
      modal.value.editInfo = true
    }
  }],[{
    label: t('editNeed'),
    icon: 'i-bx-lock-open',
    disabled: row.number == 1,
    click: () => {
      Object.keys(stateEditNeed.value).forEach(key => stateEditNeed.value[key] = row[key])
      modal.value.editNeed = true
    }
  }]
]
 
// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('level/manage/list', page.value)

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

const editInfoAction = async () => {
  try {
    loading.value.editInfo = true
    await useAPI('level/manage/edit/info', stateEditInfo.value)

    loading.value.editInfo = false
    modal.value.editInfo = false
    getList()
  }
  catch (e) {
    loading.value.editInfo = false
  }
}

const editNeedAction = async () => {
  try {
    loading.value.editNeed = true
    await useAPI('level/manage/edit/need', stateEditNeed.value)

    loading.value.editNeed = false
    modal.value.editNeed = false
    getList()
  }
  catch (e) {
    loading.value.editNeed = false
  }
}

const delAction = async (_id) => {
  try {
    loading.value.del = true
    await useAPI('level/manage/del', { _id })

    loading.value.del = false
    getList()
  }
  catch (e) {
    loading.value.del = false
  }
}

getList()
</script>
