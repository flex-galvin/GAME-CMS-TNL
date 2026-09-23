<template>
  <div>
    <UiFlex class="gap-1" wrap>
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]"/>

      <UForm :state="page" @submit="page.current = 1, getList()" class="mr-auto">
        <UInput size="sm" v-model="page.user" :placeholder="t('searchUser')" icon="i-bx-search" />
      </UForm>

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

        <template #point-data="{ row }">
          {{ useMoney().toMoney(row.point) }}
        </template>

        <template #[`redbag.count-data`]="{ row }">
          {{ useMoney().toMoney(row.redbag.count) }}
        </template>

        <template #[`redbag.use-data`]="{ row }">
          {{ useMoney().toMoney(row.redbag.use) }}
        </template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
        </template>

        <template #action-data="{ row }">
          <UButton variant="outline" color="blue" size="xs" icon="i-bxs-edit" label="Sửa" @click="openEdit(row)"/>
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
      <ManageUserInfo :user="stateUser" @close="modal.user = false" />
    </UModal>

    <!-- Modal Edit -->
    <UModal v-model="modal.edit" preventClose>
      <UForm :state="stateEdit" @submit="editAction" class="bg-card rounded-2xl p-4">
        <UFormGroup :label="t('limitedLunarUserPoint')">
          <UInput v-model="stateEdit.point" type="number" />
        </UFormGroup>

        <UFormGroup :label="t('limitedLunarUserRedbagCount')">
          <UInput v-model="stateEdit.redbag.count" type="number" />
        </UFormGroup>

        <UiFlex justify="end">
          <UButton color="yellow" type="submit" :loading="loading.edit">{{ t('edit') }}</UButton>
          <UButton color="gray" @click="modal.edit = false" :disabled="loading.edit" class="ml-1">{{ t('close') }}</UButton>
        </UiFlex>
      </UForm>
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
    key: 'user',
    label: t('user'),
  },{
    key: 'point',
    label: t('limitedLunarUserPoint'),
    sortable: true
  },{
    key: 'redbag.count',
    label: t('limitedLunarUserRedbagCount'),
    sortable: true
  },{
    key: 'redbag.use',
    label: t('limitedLunarUserRedbagUse'),
    sortable: true
  },{
    key: 'createdAt',
    label: t('createdAt'),
    sortable: true
  },
  {
    key: 'action',
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
  range: {
    start: null,
    end: null
  },
  user: null,
  total: 0,
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
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

const stateEdit = ref({
  _id: null,
  point: null,
  redbag: {
    count: null,
    use: null
  }
})

// Modal
const modal = ref({
  user: false,
  edit: false
})

// Loading
const loading = ref({
  load: true,
  edit: false
})

// View User
const viewUser = (_id) => {
  modal.value.user = true
  stateUser.value = _id
}

const openEdit = (row) => {
  Object.keys(stateEdit.value).forEach(key => stateEdit.value[key] = row[key])
  modal.value.edit = true
}

// Fetch
const editAction = async () => {
  try {
    loading.value.edit = true
    await useAPI('limited/lunar/manage/user/edit', stateEdit.value)

    loading.value.edit = false
    modal.value.edit = false
    getList()
  }
  catch (e) {
    loading.value.edit = false
  } 
}

const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('limited/lunar/manage/user/list', page.value)

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

getList()
</script>
