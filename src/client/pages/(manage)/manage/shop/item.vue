<template>
  <UiContent :title="t('menuManageShopItem')" :sub="t('menuManageShopItemInfo')">
    <UiFlex class="gap-1" wrap>
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]"/>

      <UForm :state="page" @submit="page.current = 1, getList()">
        <UInput v-model="page.search" :placeholder="t('search')" icon="i-bx-search" size="sm" />
      </UForm>

      <SelectShopCategory v-model="page.category" type="item" size="sm" class="min-w-[200px]" :placeholder="t('default')" :options="[{ _id: null, label: t('default') }]" />

      <USelectMenu 
        v-model="page.types" 
        value-attribute="value"
        option-attribute="label"
        :options="[
          { label: t('gameItem'), value: ['game_item'] },
          { label: t('gameRecharge'), value: ['game_recharge'] },
        ]"
        class="mr-auto"
      >
        <template #label>
          <span>{{ page.types[0] == 'game_item' ? t('gameItem') : t('gameRecharge') }}</span>
        </template>
      </USelectMenu>
      
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
        <template #image-data="{ row }">
          <DataItemImage :src="row.image" :type="row.type" />
        </template>

        <template #category-data="{ row }">
          <UBadge weight="semibold">{{ row.category ? row.category.name : t('default') }}</UBadge>
        </template>

        <template #type-data="{ row }">
          <UBadge color="gray" variant="soft">
            {{ typeFormat[row.type] }}
          </UBadge>
        </template>

        <template #servers-data="{ row }">
          <UiText weight="semibold" v-if="!row.servers || (!!row.servers && row.servers.length == 0)">{{ t('all') }}</UiText>
          <UBadge variant="soft" color="orange" v-else>{{ row.servers.length }} {{ t('server') }}</UBadge>
        </template>

        <template #item_amount-data="{ row }">
          {{ !row.item_amount ? 1 : toMoney(row.item_amount) }}
        </template>

        <template #price-data="{ row }">
          <UiText weight="semibold">{{ toMoney(row.price) }}</UiText>
        </template>

        <template #limit-data="{ row }">
          {{ row.limit == 0 ? t('unlimited') : `${row.limit} ${t('times')}` }}
        </template>

        <template #pin-data="{ row }">
          <UBadge :color="row.pin == 1 ? 'green' : 'gray'" variant="soft">{{ row.pin == 1 ? t('yes') : t('no') }}</UBadge>
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
        <UFormGroup :label="t('item')">
          <SelectItem v-model="stateAdd.item" :types="page.types" />
        </UFormGroup>

        <UFormGroup :label="t('category')">
          <SelectShopCategory v-model="stateAdd.category" type="item" :placeholder="t('default')" :options="[{ _id: null, label: t('all') }]" size="lg" />
        </UFormGroup>

        <UFormGroup :label="t('description')">
          <UiEditor v-model="stateAdd.description" />
        </UFormGroup>

        <UFormGroup :label="t('amount')">
          <UInput v-model="stateAdd.item_amount" type="number" />
        </UFormGroup>

        <UFormGroup :label="t('price')">
          <UInput v-model="stateAdd.price" type="number" />
        </UFormGroup>

        <UFormGroup :label="t('limited')">
          <UInput v-model="stateAdd.limit" type="number" />
        </UFormGroup>

        <UFormGroup :label="t('server')">
          <SelectGameServers v-model="stateAdd.servers" />
        </UFormGroup>

        <UFormGroup :label="t('display')">
          <SelectDisplay v-model="stateAdd.display" />
        </UFormGroup>

        <UiFlex class="gap-1">
          <SelectPin v-model="stateAdd.pin" class="mr-auto"/>

          <UButton color="yellow" type="submit" :loading="loading.add">{{ t('add') }}</UButton>
          <UButton color="gray" @click="modal.add = false" :disabled="loading.add">{{ t('close') }}</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit -->
    <UModal v-model="modal.edit" preventClose>
      <UForm :state="stateEdit" @submit="editAction" class="bg-card rounded-2xl p-4">
        <UFormGroup :label="t('category')">
          <SelectShopCategory v-model="stateEdit.category" type="item" :placeholder="t('default')" :options="[{ _id: null, label: t('all') }]" size="lg" />
        </UFormGroup>

        <UFormGroup :label="t('description')">
          <UiEditor v-model="stateEdit.description" />
        </UFormGroup>

        <UFormGroup :label="t('amount')">
          <UInput v-model="stateEdit.item_amount" type="number" />
        </UFormGroup>

        <UFormGroup :label="t('price')">
          <UInput v-model="stateEdit.price" type="number" />
        </UFormGroup>
        
        <UFormGroup :label="t('limited')">
          <UInput v-model="stateEdit.limit" type="number" />
        </UFormGroup>

        <UFormGroup :label="t('server')">
          <SelectGameServers v-model="stateEdit.servers" />
        </UFormGroup>

        <UFormGroup :label="t('display')">
          <SelectDisplay v-model="stateEdit.display" />
        </UFormGroup>

        <UiFlex class="gap-1">
          <SelectPin v-model="stateEdit.pin" class="mr-auto"/>

          <UButton color="yellow" type="submit" :loading="loading.edit">{{ t('edit') }}</UButton>
          <UButton color="gray" @click="modal.edit = false" :disabled="loading.edit">{{ t('close') }}</UButton>
        </UiFlex>
      </UForm>
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
    key: 'image',
    label: t('item'),
  },{
    key: 'name',
    label: t('name'),
    sortable: true
  },{
    key: 'category',
    label: t('category'),
  },{
    key: 'item_amount',
    label: t('amount'),
    sortable: true
  },{
    key: 'price',
    label: t('price'),
    sortable: true
  },{
    key: 'servers',
    label: t('server')
  },{
    key: 'limit',
    label: t('limited'),
    sortable: true
  },{
    key: 'pin',
    label: t('pin'),
    sortable: true
  },{
    key: 'display',
    label: t('display'),
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
  types: ['game_item'],
  search: null,
  category: null,
  total: 0,
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.types, () => getList())
watch(() => page.value.category, () => getList())
watch(() => page.value.search, (val) => !val && getList())

// State
const stateAdd = ref({
  item: null,
  category: null,
  description: null,
  item_amount: 1,
  price: null,
  servers: [],
  limit: 0,
  pin: 0,
  display: 1
})
const stateEdit = ref({
  _id: null,
  category: null,
  description: null,
  item_amount: null,
  price: null,
  servers: null,
  limit: null,
  pin: null,
  display: null
})

// Modal
const modal = ref({
  add: false,
  edit: false
})

watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
  item: null,
  category: null,
  description: null,
  item_amount: 1,
  price: null,
  servers: [],
  limit: 0,
  pin: 0,
  display: 1
}))

// Loading
const loading = ref({
  load: true,
  add: false,
  edit: false,
  del: false
})

// Type
const typeFormat = computed(() => ({
  'game_recharge': t('gameRecharge'),
  'game_item': t('gameItem'),
}))

// Actions
const actions = (row) => [
  [{
    label: t('editInfo'),
    icon: 'i-bx-pencil',
    click: () => {
      Object.keys(stateEdit.value).forEach(key => stateEdit.value[key] = row[key])
      stateEdit.value.servers = row.servers || []
      modal.value.edit = true
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
    const data = await useAPI('shop/item/manage/list', page.value)

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
    await useAPI('shop/item/manage/add', stateAdd.value)

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
    await useAPI('shop/item/manage/edit', stateEdit.value)

    loading.value.edit = false
    modal.value.edit = false
    getList()
  }
  catch (e) {
    loading.value.edit = false
  }
}

const delAction = async (_id) => {
  try {
    loading.value.del = true
    await useAPI('shop/item/manage/del', { _id })

    loading.value.del = false
    getList()
  }
  catch (e) {
    loading.value.del = false
  }
}

getList()
</script>
