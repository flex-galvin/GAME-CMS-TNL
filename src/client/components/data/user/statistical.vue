<template>
  <UCard :ui="{ body: { padding: 'p-0 sm:p-0' }, header: { padding: 'p-2 sm:p-2' } }">
    <LoadingTable v-if="loading" />

    <UTable :columns="columns" :rows="data">
      <template #login-data="{ row }">{{ row.login == -1 ? '...' : `${row.login}` }} </template>
      <template #pay-data="{ row }">{{ toMoney(row.pay) }}</template>
      <template #spend-data="{ row }">{{ toMoney(row.spend) }}</template>
      <template #wheel-data="{ row }">{{ toMoney(row.wheel) }}</template>
    </UTable>
  </UCard>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps(['typeDefault', 'user'])
const { toMoney } = useMoney()
const authStore = useAuthStore()
const loading = ref(false)
const statistical = ref(undefined)

const columns = computed(() => {
  let data = [
    { key: 'login', label: t('login') },
    { key: 'pay', label: t('payment') },
    { key: 'spend', label: t('spend') },
  ]
  data = [{ key: 'time', label: t('by') }].concat(data)
  return data
})

const data =  computed(() => {
  if(!statistical.value) return []
  const data = statistical.value
  
  return [{ 
    time: t('day'),
    pay: data.pay?.day?.money,
    spend: data.spend?.day?.coin,
    wheel: data.wheel?.day,
    login: -1,
  },{ 
    time: t('month'),
    pay: data.pay?.month?.money,
    spend: data.spend?.month?.coin,
    wheel: data.wheel?.month,
    login: data.login?.month,
  },{ 
    time: t('total'),
    pay: data.pay?.total?.money,
    spend: data.spend?.total?.coin,
    wheel: data.wheel?.total,
    login: data.login?.total,
  }]
})

const getStatistical = async () => {
  try {
    if(!authStore.isLogin) return

    loading.value = true
    const get = await useAPI('user/public/statistical', { user: props.user })

    statistical.value = get
    loading.value = false
  }
  catch(e) {
    loading.value = false
  }
}

getStatistical()
</script>