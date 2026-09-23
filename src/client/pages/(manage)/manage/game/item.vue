<template>
  <UiContent :title="t('menuManageItem')" :sub="t('menuManageItemInfo')">
    <UiFlex class="gap-1" wrap>
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" />

      <UForm :state="page" @submit="page.current = 1, getList()" class="mr-auto">
        <UInput v-model="page.search" :placeholder="t('search')" icon="i-bx-search" size="sm" />
      </UForm>

      <UiFlex class="gap-1">
        <UDropdown :items="[[
          { label: t('addSingle'), click: () => modal.add = true },
          { label: t('addMultiple'), click: () => modal.multiple = true }
        ]]">
          <UButton color="yellow" icon="i-mingcute-down-fill">{{ t('action') }}</UButton>
        </UDropdown>

        <UDropdown :items="[
          [{ label: 'Excel', click: () => exportAction('excel')}],
          [{ label: 'Json', click: () => exportAction('json')}],
        ]">
          <UButton color="green" icon="i-healthicons-excel-logo" :loading="loading.export">{{ t('export') }}</UButton>
        </UDropdown>
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
        <template #type-data="{ row }">
          <UBadge color="gray" variant="soft">
            {{ typeFormat[row.type] }}
          </UBadge>
        </template>

        <template #item_image-data="{ row }">
          <DataItemImage :src="row.item_image" :type="row.type" />
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
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="5" />
    </UiFlex>

    <!-- Modal Add -->
    <UModal v-model="modal.add" preventClose>
      <UForm :state="stateAdd" @submit="addAction" class="bg-card rounded-2xl p-4">
        <UFormGroup :label="t('type')">
          <USelectMenu 
            v-model="stateAdd.type" 
            size="lg" 
            value-attribute="value"
            :options="[
              { label: t('gameRecharge'), value: 'game_recharge' },
              { label: t('gameItem'), value: 'game_item' },
            ]"
          >
            <template #label>
              <span v-if="!stateAdd.type">{{ t('selectType') }}</span>
              <span v-else>{{ typeFormat[stateAdd.type] }}</span>
            </template>
          </USelectMenu>
        </UFormGroup>

        <UFormGroup :label="t('id')">
          <UInput v-model="stateAdd.item_id" />
        </UFormGroup>

        <UFormGroup :label="t('name')">
          <UInput v-model="stateAdd.item_name" />
        </UFormGroup>

        <UFormGroup :label="t('image')">
          <UInput v-model="stateAdd.item_image" />
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
        <UFormGroup :label="t('id')">
          <UInput v-model="stateEdit.item_id" />
        </UFormGroup>

        <UFormGroup :label="t('name')">
          <UInput v-model="stateEdit.item_name" />
        </UFormGroup>

        <UFormGroup :label="t('image')">
          <UInput v-model="stateEdit.item_image" />
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton color="yellow" type="submit" :loading="loading.edit">{{ t('edit') }}</UButton>
          <UButton color="gray" @click="modal.edit = false" :disabled="loading.edit">{{ t('close') }}</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Multiple -->
    <UModal v-model="modal.multiple" preventClose>
      <UForm :state="stateMultiple" @submit="multipleAction" class="bg-card rounded-2xl p-4">
        <UFormGroup :label="t('uploadFile')">
          <UiUploadJson v-model="stateMultiple.items">
            <template #default="{ select, loading : loadingFile }">
              <UInput icon="i-bx-box" :placeholder="t('uploadFileSelect')" :model-value="stateMultiple.items" :loading="loadingFile" :disabled="loading.multiple" readonly @click="select"/>
            </template>
          </UiUploadJson>
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton type="submit" :loading="loading.multiple">{{ t('add') }}</UButton>
          <UButton color="gray" @click="modal.multiple = false" :disabled="loading.multiple">{{ t('close') }}</UButton>
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
    key: 'item_id',
    label: t('id'),
    sortable: true
  },{
    key: 'type',
    label: t('type'),
    sortable: true
  },{
    key: 'item_image',
    label: t('image'),
  },{
    key: 'item_name',
    label: t('name'),
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
  item_id: null,
  item_name: null,
  item_image: null,
  type: null
})
const stateEdit = ref({
  _id: null,
  item_id: null,
  item_name: null,
  item_image: null,
})
const stateMultiple = ref({
  items: null
})

// Modal
const modal = ref({
  add: false,
  edit: false,
  multiple: false
})

watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
  item_id: null,
  item_name: null,
  item_image: null,
  type: null
}))
watch(() => modal.value.multiple, (val) => !val && (stateMultiple.value = {
  items: null
}))

// Loading
const loading = ref({
  load: true,
  add: false,
  edit: false,
  del: false,
  multiple: false,
  export: false
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
    const data = await useAPI('item/game/manage/list', page.value)

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
    await useAPI('item/game/manage/add/single', stateAdd.value)

    loading.value.add = false
    modal.value.add = false
    getList()
  }
  catch (e) {
    loading.value.add = false
  }
}

const multipleAction = async () => {
  try {
    loading.value.multiple = true
    await useAPI('item/game/manage/add/multiple', stateMultiple.value)

    loading.value.multiple = false
    modal.value.multiple = false
    getList()
  }
  catch (e) {
    loading.value.multiple = false
  }
}

const editAction = async () => {
  try {
    loading.value.edit = true
    await useAPI('item/game/manage/edit', stateEdit.value)

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
    await useAPI('item/game/manage/del', { _id })

    loading.value.del = false
    getList()
  }
  catch (e) {
    loading.value.del = false
  }
}

const exportAction = async (type) => {
  try {
    loading.value.export = true
    const url = await useAPI('item/game/manage/export', { type: type })

    window.open(url, '_blank')

    loading.value.export = false
  }
  catch (e) {
    loading.value.export = false
  }
}

getList()
</script>
