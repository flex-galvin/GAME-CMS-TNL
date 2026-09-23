<template>
  <div>
    <UiFlex class="mb-2">
      <USelectMenu v-model="page.size" :options="[5,10,20,50,100]" />

      <UBadge variant="soft" color="gray" size="lg" class="cursor-pointer ml-auto" @click="viewUser(referral._id)" v-if="referral">
        <UiIcon name="i-bx-user" class="mr-2" /> {{ referral.username }}
      </UBadge>
    </UiFlex>

    <UCard class="mb-2" :ui="{ 
      body: { padding: 'p-0 sm:p-0' },
      header: { padding: 'px-3 sm:px-3 py-2 sm:py-2' },
      footer: { padding: 'p-2 sm:p-2' },
    }">
      <LoadingTable v-if="loading.load" />

      <UTable v-model:sort="page.sort" :columns="columns" :rows="list">
        <template #username-data="{row}">
          <UBadge variant="soft" color="gray" class="cursor-pointer" @click="viewUser(row._id)">
            {{ row.username }}
          </UBadge>
        </template>

        <template #pay-data="{row}">
          {{ useMoney().toMoney(row.pay.total.money) }}
        </template>

        <template #login-data="{row}">
          {{ row.login.month }}
        </template>
      </UTable>
    </UCard>

    <UiFlex justify="end">
      <UPagination v-model="page.current" :page-count="page.size" :total="page.total" :max="5" />
    </UiFlex>

    <!-- Modal User View -->
    <UModal v-model="modal.user" :ui="{width: 'sm:max-w-[900px]'}">
      <ManageUserInfo :user="stateUser" @close="modal.user = false" />
    </UModal>
  </div>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps(['user'])

const loading = ref({
  load: true
})

const list = ref([])

const referral = ref(null)

const columns = [
  {
    key: 'username',
    label: t('user'),
  },
  {
    key: 'pay',
    label: t('payment'),
  },
  {
    key: 'login',
    label: t('login'),
  }
]

const page = ref({
  size: 5,
  current: 1,
  sort: {
    column: 'pay.total.money',
    direction: 'desc'
  },
  type: undefined,
  total: 0,
  user: props.user || null
})
watch(() => page.value.size, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.sort.column, () => getList())
watch(() => page.value.sort.direction, () => getList())

const stateUser = ref(undefined)

const modal = ref({
  user: false
})

const viewUser = (_id) => {
  stateUser.value = _id
  modal.value.user = true
}

const getList = async () => {
  try {
    loading.value.load = true
    const data = await useAPI('user/public/referral', page.value)

    loading.value.load = false
    referral.value = data.referral
    list.value = data.list
    page.value.total = data.total
  }
  catch (e) {
    loading.value.load = false
  } 
}

getList()
</script>