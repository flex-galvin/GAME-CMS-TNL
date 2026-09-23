<template>
  <UiContent :title="t('menuManageNews')" :sub="t('menuManageNewsInfo')">
    <UiFlex class="gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" />

      <UForm :state="page" @submit="page.current = 1, getList()" class="mr-auto">
        <UInput size="sm" v-model="page.search" icon="i-bx-search" :placeholder="t('search')" />
      </UForm>

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
        <template #category-data="{ row }">
          <UBadge :color="row.category.color" variant="soft">{{ row.category.name }}</UBadge>
        </template>

        <template #title-data="{ row }">
          <NuxtLink :to="`/news/${row.key}`" target="_blank">
            <UiText class="text-gradient font-semibold min-w-[200px] max-w-[200px] whitespace-normal">{{ row.title }}</UiText>
          </NuxtLink>
        </template>

        <template #pin-data="{ row }">
          <UBadge :color="row.pin == 1 ? 'green' : 'gray'" variant="soft">{{ row.pin == 1 ? t('yes') : t('no') }}</UBadge>
        </template>

        <template #display-data="{ row }">
          <UBadge :color="row.display == 1 ? 'green' : 'gray'" variant="soft">{{ row.display == 1 ? t('show') : t('hide') }}</UBadge>
        </template>

        <template #createdAt-data="{ row }">
          {{ useDayJs().displayFull(row.createdAt) }}
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
        <UFormGroup :label="t('category')">
          <SelectNewsCategory v-model="stateAdd.category" />
        </UFormGroup>

        <UFormGroup :label="t('title')">
          <UInput v-model="stateAdd.title" />
        </UFormGroup>

        <UFormGroup :label="t('description')">
          <UTextarea v-model="stateAdd.description" autoresize />
        </UFormGroup>

        <UFormGroup :label="t('image')">
          <UiUploadImage v-model="stateAdd.og_image">
            <template #default="{ select, loading }">
              <UInput :model-value="stateAdd.og_image" :loading="loading" readonly @click="select"/>
            </template>
          </UiUploadImage>
        </UFormGroup>

        <UFormGroup :label="t('display')">
          <SelectDisplay v-model="stateAdd.display" />
        </UFormGroup>

        <UiFlex class="gap-1">
          <SelectPin v-model="stateAdd.pin" class="mr-auto" />

          <UButton color="yellow" type="submit" :loading="loading.add">{{ t('add') }}</UButton>
          <UButton color="gray" @click="modal.add = false" :disabled="loading.add">{{ t('close') }}</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit -->
    <UModal v-model="modal.edit" preventClose>
      <UForm :state="stateEdit" @submit="editAction" class="bg-card rounded-2xl p-4">
        <UFormGroup :label="t('category')">
          <SelectNewsCategory v-model="stateEdit.category" />
        </UFormGroup>

        <UFormGroup :label="t('title')">
          <UInput v-model="stateEdit.title" />
        </UFormGroup>

        <UFormGroup :label="t('description')">
          <UTextarea v-model="stateEdit.description" autoresize />
        </UFormGroup>

        <UFormGroup :label="t('image')">
          <UiUploadImage v-model="stateEdit.og_image">
            <template #default="{ select, loading }">
              <UInput :model-value="stateEdit.og_image" :loading="loading" readonly @click="select"/>
            </template>
          </UiUploadImage>
        </UFormGroup>

        <UFormGroup :label="t('display')">
          <SelectDisplay v-model="stateEdit.display" />
        </UFormGroup>

        <UiFlex class="gap-1">
          <SelectPin v-model="stateEdit.pin" class="mr-auto" />

          <UButton color="yellow" type="submit" :loading="loading.edit">{{ t('edit') }}</UButton>
          <UButton color="gray" @click="modal.edit = false" :disabled="loading.edit">{{ t('close') }}</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Content -->
    <UModal v-model="modal.content" preventClose :ui="{width: 'sm:max-w-[calc(90%)] md:max-w-[calc(80%)] lg:max-w-4xl'}">
      <UForm :state="stateContent" @submit="contentAction" class="bg-card rounded-2xl p-4">
        <UiEditor class="bg-card-box" v-model="stateContent.content"></UiEditor>

        <UiFlex justify="end" class="mt-2 gap-1">
          <UButton color="yellow" type="submit" :loading="loading.content">{{ t('save') }}</UButton>
          <UButton color="gray" @click="modal.content = false" :disabled="loading.content">{{ t('close') }}</UButton>
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
    key: 'title',
    label: t('title'),
  },{
    key: 'category',
    label: t('category'),
  },{
    key: 'view',
    label: t('view'),
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
    key: 'createdAt',
    label: t('createdAt'),
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
watch(() => page.value.search, (val) => !val && getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())

// State
const stateAdd = ref({
  category: null,
  title: null,
  description: null,
  og_image: null,
  pin: 0,
  display: 1
})
const stateEdit = ref({
  _id: null,
  category: null,
  title: null,
  description: null,
  og_image: null,
  pin: null,
  display: null
})
const stateContent = ref({
  _id: null,
  content: null
})

// Modal
const modal = ref({
  add: false,
  edit: false,
  content: false
})

watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
  category: null,
  title: null,
  description: null,
  og_image: null,
  pin: 0,
  display: 1
}))

// Loading
const loading = ref({
  load: true,
  add: false,
  edit: false,
  del: false,
  content: false
})

// Actions
const actions = (row) => [
  [{
    label: t('editInfo'),
    icon: 'i-bx-pencil',
    click: () => {
      Object.keys(stateEdit.value).forEach(key => stateEdit.value[key] = row[key])
      stateEdit.value.category = row.category._id
      modal.value.edit = true
    }
  },{
    label: t('editContent'),
    icon: 'i-bx-spreadsheet',
    click: async () => {
      try {
        const content = await useAPI('news/manage/content/get', { _id: row._id })
        stateContent.value._id = row._id
        stateContent.value.content = content
        modal.value.content = true
      }
      catch (e) {
        return
      }
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
    const data = await useAPI('news/manage/list', page.value)

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
    await useAPI('news/manage/add', stateAdd.value)

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
    await useAPI('news/manage/edit', stateEdit.value)

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
    await useAPI('news/manage/del', { _id })

    loading.value.del = false
    getList()
  }
  catch (e) {
    loading.value.del = false
  }
}

const contentAction = async () => {
  try {
    loading.value.content = true
    await useAPI('news/manage/content/edit', stateContent.value)

    loading.value.content = false
    modal.value.content = false
  }
  catch (e) {
    loading.value.content = false
  }
} 

getList()
</script>
