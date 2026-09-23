<template>
  <div>
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
        <template #server-data="{ row }">
          <UBadge color="gray" variant="soft">{{ row.server }}</UBadge>
        </template>
        
        <template #end-data="{ row }">
          {{ useDayJs().displayFull(row.end) }}
        </template>

        <template #send-data="{ row }">
          <UBadge :color="!!row.send ? 'primary' : 'gray'" variant="soft">{{ !!row.send ? t('sendAwardTrue') : t('sendAwardFalse') }}</UBadge>
        </template>

        <template #active-data="{ row }">
          <UBadge :color="!!row.active ? 'green' : 'gray'" variant="soft">{{ !!row.active ? t('activeTrue') : t('activeFalse') }}</UBadge>
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="actions(row)">
            <UButton color="gray" icon="i-bx-dots-horizontal-rounded" :disabled="!!loading.del || !!loading.send"/>
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
        <UFormGroup :label="t('server')">
          <SelectGameServer v-model="stateAdd.server" />
        </UFormGroup>

        <UFormGroup :label="t('end')">
          <SelectDate v-model="stateAdd.end"  />
        </UFormGroup>

        <UiFlex class="gap-1">
          <UiFlex class="mr-auto gap-2">
            <UToggle v-model="stateAdd.active" />
            <UiText size="sm" weight="semibold" color="gray" :text="t('active')" />
          </UiFlex>

          <UButton color="yellow" type="submit" :loading="loading.add">{{ t('add') }}</UButton>
          <UButton color="gray" @click="modal.add = false" :disabled="loading.add">{{ t('close') }}</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit -->
    <UModal v-model="modal.edit" preventClose>
      <UForm :state="stateEdit" @submit="editAction" class="bg-card rounded-2xl p-4">
        <UFormGroup :label="t('server')">
          <SelectGameServer v-model="stateEdit.server" />
        </UFormGroup>

        <UFormGroup :label="t('end')">
          <SelectDate v-model="stateEdit.end"  />
        </UFormGroup>

        <UiFlex class="gap-1">
          <UiFlex class="mr-auto gap-2">
            <UToggle v-model="stateEdit.active" />
            <UiText size="sm" weight="semibold" color="gray" :text="t('active')" />
          </UiFlex>

          <UButton color="yellow" type="submit" :loading="loading.edit">{{ t('edit') }}</UButton>
          <UButton color="gray" @click="modal.edit = false" :disabled="loading.edit">{{ t('close') }}</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!--Modal Award-->
    <UModal v-model="modal.award" preventClose :ui="{width: 'sm:max-w-[700px]'}">
      <UiContent :title="t('award')" :sub="t('editAward')" class="bg-card rounded-2xl p-4">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square :disabled="loading.award" @click="modal.award = false"></UButton>
        </template>

        <SelectItemListRank v-model="stateAward.award" />

        <UiFlex justify="end" class="mt-2 gap-1">
          <UButton color="yellow" @click="awardAction" :loading="loading.award">{{ t('save') }}</UButton>
          <UButton color="gray" @click="modal.award = false" :disabled="loading.award">{{ t('close') }}</UButton>
        </UiFlex>
      </UiContent>
    </UModal>

    <!--Modal Log-->
    <UModal v-model="modal.log" preventClose :ui="{width: 'sm:max-w-[700px]'}">
      <UiContent :title="t('log')" :sub="t('logSub')" class="bg-card rounded-2xl p-4">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.log = false"></UButton>
        </template>

        <ManageRankProcessLog :fetch-id="stateView._id" />
      </UiContent>
    </UModal>

    <!--Modal View-->
    <UModal v-model="modal.view" preventClose :ui="{width: 'sm:max-w-[700px]'}">
      <UiContent :title="t('rank')" :sub="t('rankSub')" class="bg-card rounded-2xl p-4">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.view = false"></UButton>
        </template>

        <ManageRankProcessView :fetch-id="stateView._id" />
      </UiContent>
    </UModal>
  </div>
</template>

<script setup>
const { t } = useI18n()

// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'server',
    label: t('server'),
  },{
    key: 'end',
    label: t('end'),
    sortable: true
  },{
    key: 'send',
    label: t('sendAward'),
    sortable: true
  },{
    key: 'active',
    label: t('active'),
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
  total: 0,
  type: 'level'
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())

// State
const stateAdd = ref({
  type: 'level',
  server: null,
  end: null,
  award: [],
  active: false
})
const stateEdit = ref({
  _id: null,
  server: null,
  end: null,
  active: null,
})
const stateAward = ref({
  _id: null,
  award: null
})
const stateView = ref({
  _id: null
})

// Modal
const modal = ref({
  add: false,
  edit: false,
  award: false,
  log: false,
  view: false
})

watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
  type: 'level',
  server: null,
  end: null,
  award: [],
  active: false
}))

// Loading
const loading = ref({
  load: true,
  add: false,
  edit: false,
  award: false,
  del: false,
  send: false
})

// Actions
const actions = (row) => [
  [{
    label: t('rank'),
    icon: 'i-bx-bar-chart-alt-2',
    click: () => {
      stateView.value._id = row._id
      modal.value.view = true
    }
  },{
    label: t('log'),
    icon: 'i-icon-park-outline-log',
    click: () => {
      stateView.value._id = row._id
      modal.value.log = true
    }
  }],[{
    label: t('sendAwardEarly'),
    icon: 'i-bx-mail-send',
    click: () => sendAction(row._id)
  }],[{
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
      stateAward.value._id = row._id
      stateAward.value.award = JSON.parse((JSON.stringify(row.award)))
      modal.value.award = true
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
    const data = await useAPI('rank/manage/process/list', page.value)

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
    await useAPI('rank/manage/process/add', stateAdd.value)

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
    await useAPI('rank/manage/process/edit', stateEdit.value)

    loading.value.edit = false
    modal.value.edit = false
    getList()
  }
  catch (e) {
    loading.value.edit = false
  }
}

const awardAction = async () => {
  try {
    loading.value.award = true
    await useAPI('rank/manage/process/award', stateAward.value)

    loading.value.award = false
    modal.value.award = false
    getList()
  }
  catch (e) {
    loading.value.award = false
  }
}

const delAction = async (_id) => {
  try {
    loading.value.del = true
    await useAPI('rank/manage/process/del', { _id })

    loading.value.del = false
    getList()
  }
  catch (e) {
    loading.value.del = false
  }
}

const sendAction = async (_id) => {
  try {
    loading.value.send = true
    await useAPI('rank/manage/process/send', { _id })

    loading.value.send = false
    getList()
  }
  catch (e) {
    loading.value.send = false
  }
}

getList()
</script>
