<template>
  <UiContent :title="t('menuManageIPUser')" :sub="t('menuManageIPUserInfo')">
    <UiFlex class="gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]"/>

      <UForm :state="page" @submit="page.current = 1, getList()">
        <UInput v-model="page.search.key" :placeholder="t('search')" icon="i-bx-search" size="sm" />
      </UForm>
    </UiFlex>
    
    <!-- Table -->
    <UCard class="my-2" :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable 
        v-model:sort="page.sort"
        :columns="selectedColumns"
        :rows="list"
      >
        <template #ip-data="{ row }">
          <UiText weight="semibold">{{ row.ip }}</UiText>
        </template>

        <template #users-data="{ row }">
          <UiFlex wrap>
            <UButton 
              v-for="user in row.users" :key="user._id"
              size="2xs" color="gray" class="m-1"
              @click="viewUser(user._id)"
            >{{ user.username }}</UButton>
          </UiFlex>
        </template>
        
        <template #block-data="{ row }">
          <UBadge variant="soft" :color="row.block == 1 ? 'red' : 'gray'">{{ row.block == 1 ? t('yes') : t('no') }}</UBadge>
        </template>

        <template #action-data="{ row }">
          <UButton v-if="!row.block" color="gray" size="xs" icon="i-bxs-lock-alt" @click="block(row.ip, 'block')" :loading="loading.block" />
          <UButton v-if="!!row.block" color="gray" size="xs" icon="i-bxs-lock-open-alt" @click="block(row.ip, 'unblock')" :loading="loading.block" />
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
  </UiContent>
</template>

<script setup>
const { t } = useI18n()

// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'ip',
    label: t('ip'),
  },{
    key: 'count',
    label: t('user'),
    sortable: true
  },{
    key: 'users',
    label: t('list')
  },{
    key: 'block',
    label: t('block'),
    sortable: true
  },{
    key: 'action',
    label: t('action'),
  }
]
const selectedColumns = ref([...columns])

// Page
const page = ref({
  size: 10,
  current: 1,
  sort: {
    column: 'count',
    direction: 'desc'
  },
  search: {
    key: null,
    by: 'IP'
  },
  total: 0,
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.search.key, (val) => !val && getList())

// Modal
const modal = ref({
  user: false
})

// Loading
const loading = ref({
  load: true
})

// State
const stateUser = ref(undefined)

// View User
const viewUser = (_id) => {
  modal.value.user = true
  stateUser.value = _id
}

// Fetch
const block = async (ip, action) => {
  try {
    loading.value.true = true
    await useAPI('ip/user/block', { ip, action })

    loading.value.true = false
    getList()
  }
  catch (e) {
    loading.value.block = false
  }
}

const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('ip/user/list', page.value)

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
