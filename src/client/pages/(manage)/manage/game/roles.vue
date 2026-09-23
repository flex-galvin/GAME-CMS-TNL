<template>
  <UiContent :title="t('menuManageGameRoles')" :sub="t('menuManageGameRolesInfo')">
    <UiFlex class="gap-1" wrap>
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" :disabled="!page.server_id" />

      <UForm :state="page" @submit="page.current = 1, getList()" class="mr-auto">
        <UiFlex class="gap-1">
          <UInput v-model="page.search.key" :placeholder="t('search')" icon="i-bx-search" size="sm" :disabled="!page.server_id" />
          <USelectMenu v-model="page.search.by" :options="['USER', 'ROLE', 'ID']" :disabled="!page.server_id" />
        </UiFlex>
      </UForm>

      <UiFlex class="gap-1">
        <UButton color="green">{{ page.total }} <UIcon name="i-bxs-user" /></UButton>
        <SelectGameServer auto v-model="page.server_id" size="sm" />
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
        <template #account-data="{ row }">
          <UButton size="2xs" color="gray" @click="viewUser(row.account)" :disabled="!!loading.user">{{ row.account }}</UButton>
        </template>

        <template #power-data="{row}">
          {{ useMoney().toMoney(row.power) }}
        </template>

        <template #knb-data="{row}">
          {{ useMoney().toMoney(row.knb) }}
        </template>

        <template #coin-data="{row}">
          {{ useMoney().toMoney(row.coin) }}
        </template>

        <template #action-data="{row}">
          <UButton icon="i-bx-mail-send" color="gray" :disabled="!!loading.send" @click="openSend(row)" class="mr-1" />
          <UButton icon="i-bx-play" color="gray" :disabled="!!loading.play" @click="openPlay(row)" />
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="between">
      <USelectMenu v-model="selectedColumns"  :options="columns" multiple :placeholder="t('selectColumns')" />
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="5"/>
    </UiFlex>

    <!--Modal User Info-->
    <UModal v-model="modal.user" :ui="{width: 'sm:max-w-[900px]'}">
      <ManageUserInfo :user="stateUser" @close="modal.user = false" />
    </UModal>

    <!-- Modal Send -->
    <UModal v-model="modal.send" prevent-close :ui="{width: 'sm:max-w-[800px]'}">
      <ManageGameSend class="bg-card rounded-2xl p-4" :user="stateSend.user" :server="stateSend.server" @close="modal.send = false" />
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
    key: 'account',
    label: t('user'),
  },{
    key: 'role_id',
    label: t('id'),
  },{
    key: 'role_name',
    label: t('name'),
  },{
    key: 'level',
    label: t('level'),
    sortable: true
  },{
    key: 'power',
    label: t('power'),
    sortable: true
  },{
    key: 'vip',
    label: t('vip'),
    sortable: true
  },{
    key: 'knb',
    label: t('gamegold'),
    sortable: true
  },{
    key: 'coin',
    label: t('gamecoin'),
    sortable: true
  },{
    key: 'action',
    label: t('action'),
  }
]
const selectedColumns = ref([...columns])

// Page
const page = ref({
  server_id: null,
  size: 10,
  current: 1,
  sort: {
    column: 'power',
    direction: 'desc'
  },
  search: {
    key: null,
    by: 'USER'
  },
  total: 0
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())
watch(() => page.value.search.key, (val) => !val && getList())
watch(() => page.value.server_id, () => getList())

// State
const stateSend = ref({
  user: null,
  server: null
})

const stateUser = ref(undefined)

// Modal
const modal = ref({
  send: false,
  user: false
})

// Loading
const loading = ref({
  load: false,
  user: false,
  send: false,
  play: false
})

// View User
const viewUser = async (username) => {
  try {
    loading.value.user = true
    const id = await useAPI('user/manage/get-id', {
      username: username
    })

    stateUser.value = id
    modal.value.user = true
    loading.value.user = false
  }
  catch(e){
    loading.value.user = false
  }
}

// Send
const openSend = async (row) => {
  try {
    loading.value.send = true
    const id = await useAPI('user/manage/get-id', {
      username: row.account
    })

    stateSend.value.server = page.value.server_id
    stateSend.value.user = id
    loading.value.send = false
    modal.value.send = true
  }
  catch (e) {
    loading.value.send = false
  }
}

// Play
const openPlay = async (row) => {
  try {
    loading.value.play = true
    const data = await useAPI('game/manage/start', {
      username: row.account,
      server: page.value.server_id,
      role: row.role_id
    })

    loading.value.play = false
    usePlay().manage(data)
  }
  catch (e) {
    loading.value.play = false
  }
}

// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('game/manage/roles', page.value)

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}
</script>
