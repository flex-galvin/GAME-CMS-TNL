<template>
  <div>
    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <LoadingTable v-if="loading.load" />

      <UTable :columns="columns" :rows="list">
        <template #rank-data="{ row }">
          <UBadge color="gray" variant="soft">Hạng {{ row.rank }}</UBadge>
        </template>

        <template #account-data="{ row }">
          <UButton size="2xs" color="gray" @click="viewUser(row.account)" :disabled="!!loading.user">{{ row.account }}</UButton>
        </template>

        <template #value-data="{row}">
          {{ useMoney().toMoney(row.power || row.level) }}
        </template>
      </UTable>
    </UCard>

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
    label: t('rank')
  },{
    key: 'account',
    label: t('user'),
  },{
    key: 'role_name',
    label: t('role'),
  },{
    key: 'value',
    label: 'Chỉ số'
  }
]

// Page
const page = ref({
  fetchID: props.fetchId,
})

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
    const data = await useAPI('rank/manage/process/view', page.value)

    loading.value.load = false
    list.value = data
  }
  catch (e) {
    loading.value.load = false
  } 
}

onMounted(() => setTimeout(getList, 1))
</script>