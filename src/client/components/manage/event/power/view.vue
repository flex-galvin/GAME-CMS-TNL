<template>
  <div>
    <UiFlex class="gap-1">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" />

      <UForm :state="page" @submit="page.current = 1, getList()" class="ml-auto">
        <UiFlex class="gap-1">
          <UInput v-model="page.search.key" :placeholder="t('search')" icon="i-bx-search" size="sm" />
          <USelectMenu v-model="page.search.by" :options="['ACCOUNT', 'ROLE-ID', 'ROLE-NAME']" />
        </UiFlex>
      </UForm>
    </UiFlex>

    <UCard class="my-2" :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable :columns="columns" :rows="list">
        <template #rank-data="{ row }">
          <UBadge color="gray" variant="soft">{{ t('rank') }} {{ row.rank }}</UBadge>
        </template>

        <template #account-data="{ row }">
          <UButton size="2xs" color="gray" @click="viewUser(row.account)" :disabled="!!loading.user">{{ row.account }}</UButton>
        </template>

        <template #power-data="{row}">
          <UiText color="green">+ {{ useMoney().toMoney(row.power) }}</UiText>
        </template>
      </UTable>
    </UCard>

    <!-- Pagination -->
    <UiFlex justify="end" v-if="page.total > list.length">
      <UPagination :max="5" :page-count="page.size" :total="page.total" v-model="page.current" />
    </UiFlex>

    <!--Modal User Info-->
    <UModal v-model="modal.user" :ui="{width: 'sm:max-w-[900px]'}">
      <ManageUserInfo :user="stateUser" @close="modal.user = false" />
    </UModal>
  </div>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps(['fetchId'])

// List
const list = ref([])

// Columns
const columns = [
  {
    key: 'rank',
    label: t('rank'),
  },{
    key: 'server',
    label: t('server'),
  },{
    key: 'account',
    label: t('account'),
  },{
    key: 'role_name',
    label: t('role'),
  },{
    key: 'power',
    label: t('powerUp')
  }
]

// Page
const page = ref({
  size: 10,
  current: 1,
  search: {
    key: null,
    by: 'ACCOUNT'
  },
  total: 0,
  fetchID: props.fetchId,
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.search.key, (val) => !val && getList())

// Modal
const modal = ref({
  user: false
})

// Loading
const loading = ref({
  load: false,
  user: false
})

// State
const stateUser = ref(undefined)

// View User
const viewUser = async (username) => {
  try {
    loading.value.user = true
    const id = await useAPI('user/manage/get-id', { username: username })

    stateUser.value = id
    modal.value.user = true
    loading.value.user = false
  }
  catch(e){
    loading.value.user = false
  }
}

// Fetch
const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('event/manage/power/view', page.value)

    loading.value.load = false
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

onMounted(() => setTimeout(getList, 1))
</script>