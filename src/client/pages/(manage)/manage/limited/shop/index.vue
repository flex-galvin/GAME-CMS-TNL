<template>
  <UiContent :title="t('menuManageLimitedShop')" :sub="t('menuManageLimitedShopInfo')">
    <UiFlex class="gap-1" wrap>
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]"/>

      <UForm :state="page" @submit="page.current = 1, getList()" class="mr-auto">
        <UInput v-model="page.search" :placeholder="t('search')" icon="i-bx-search" size="sm" />
      </UForm>

      <UiFlex class="gap-1">
        <UButton color="yellow" icon="i-bx-plus" @click="modal.add = true">{{ t('add') }}</UButton>
        <UButton color="rose" icon="i-bx-time" @click="navigateTo('/manage/limited/shop/history')">{{ t('history') }}</UButton>
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
        <template #name-data="{ row }">
          <UiText weight="semibold">{{ row.name }}</UiText>
        </template>

        <template #gift-data="{ row }">
          <DataItemListMini :max="2" :items="row.gift" />
        </template>

        <template #price-data="{ row }">
          <UiText weight="semibold">{{ useMoney().toMoney(row.price) }}</UiText>
        </template>

        <template #limit-data="{ row }">
          {{ row.limit == 0 ? t('unlimited') : `${row.limit} ${t('times')}` }}
        </template>

        <template #[`time.start-data`]="{ row }">
          <UiText color="green">{{ useDayJs().displayFull(row.time.start) }}</UiText>
        </template>

        <template #[`time.end-data`]="{ row }">
          <UiText color="rose">{{ useDayJs().displayFull(row.time.end) }}</UiText>
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
        <UFormGroup :label="t('name')">
          <UInput v-model="stateAdd.name" />
        </UFormGroup>

        <UFormGroup :label="t('price')">
          <UInput v-model="stateAdd.price" type="number" />
        </UFormGroup>

        <UFormGroup :label="t('limited')">
          <UInput v-model="stateAdd.limit" type="number" />
        </UFormGroup>

        <UFormGroup :label="t('time')">
          <UiFlex class="gap-1">
            <SelectDate time v-model="stateAdd.time.start" :placeholder="t('start')" class="grow" />
            <SelectDate time v-model="stateAdd.time.end" :placeholder="t('end')" class="grow" />
          </UiFlex>
        </UFormGroup>

        <UiFlex class="gap-1" justify="end">
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

        <UFormGroup :label="t('price')">
          <UInput v-model="stateEdit.price" type="number" />
        </UFormGroup>

        <UFormGroup :label="t('limited')">
          <UInput v-model="stateEdit.limit" type="number" />
        </UFormGroup>

        <UFormGroup :label="t('time')">
          <UiFlex class="gap-1">
            <SelectDate time v-model="stateEdit.time.start" :placeholder="t('start')" class="grow" />
            <SelectDate time v-model="stateEdit.time.end" :placeholder="t('end')" class="grow" />
          </UiFlex>
        </UFormGroup>

        <UiFlex class="gap-1" justify="end">
          <UButton color="yellow" type="submit" :loading="loading.edit">{{ t('edit') }}</UButton>
          <UButton color="gray" @click="modal.edit = false" :disabled="loading.edit">{{ t('close') }}</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!--Modal Gift-->
    <UModal v-model="modal.gift" preventClose :ui="{width: 'sm:max-w-[700px]'}">
      <UForm :state="stateGift" @submit="giftAction" class="bg-card rounded-2xl p-4">
        <SelectItemList  v-model="stateGift.gift" :types="['coin', 'wheel', 'game_item']" />

        <UiFlex justify="end" class="gap-1 mt-2">
          <UButton color="yellow" type="submit" :loading="loading.gift">{{ t('save') }}</UButton>
          <UButton color="gray" @click="modal.gift = false" :disabled="loading.gift">{{ t('close') }}</UButton>
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
    key: 'name',
    label: t('name'),
    sortable: true
  },{
    key: 'gift',
    label: t('item'),
  },{
    key: 'buyed',
    label: t('buyed'),
    sortable: true
  },{
    key: 'price',
    label: t('price'),
    sortable: true
  },{
    key: 'limit',
    label: t('limited'),
    sortable: true
  },{
    key: 'time.start',
    label: t('start'),
    sortable: true
  },{
    key: 'time.end',
    label: t('end'),
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
  search: null,
  total: 0
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.search, (val) => !val && getList())

// State
const stateAdd = ref({
  name: null,
  price: null,
  limit: 0,
  time: {
    start: null,
    end: null
  }
})
const stateEdit = ref({
  _id: null,
  name: null,
  price: null,
  limit: null,
  time: {
    start: null,
    end: null
  }
})
const stateGift = ref({
  _id: null,
  gift: null
})

// Modal
const modal = ref({
  add: false,
  edit: false,
  gift: false
})

watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
  name: null,
  price: null,
  limit: 0,
  time: {
    start: null,
    end: null
  }
}))

// Loading
const loading = ref({
  load: true,
  add: false,
  edit: false,
  gift: false,
  del: false
})

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
    label: t('editAward'),
    icon: 'i-bx-gift',
    click: () => {
      stateGift.value._id = row._id
      stateGift.value.gift = JSON.parse((JSON.stringify(row.gift)))
      modal.value.gift = true
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
    const data = await useAPI('limited/shop/manage/list', page.value)

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
    await useAPI('limited/shop/manage/add', stateAdd.value)

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
    await useAPI('limited/shop/manage/edit', stateEdit.value)

    loading.value.edit = false
    modal.value.edit = false
    getList()
  }
  catch (e) {
    loading.value.edit = false
  }
}

const giftAction = async () => {
  try {
    loading.value.gift = true
    await useAPI('limited/shop/manage/gift', stateGift.value)

    loading.value.gift = false
    modal.value.gift = false
    getList()
  }
  catch (e) {
    loading.value.gift = false
  }
}

const delAction = async (_id) => {
  try {
    loading.value.del = true
    await useAPI('limited/shop/manage/del', { _id })

    loading.value.del = false
    getList()
  }
  catch (e) {
    loading.value.del = false
  }
}

getList()
</script>
