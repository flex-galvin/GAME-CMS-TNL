<template>
  <div>
    <UiFlex class="mb-2">
      <UTabs class="w-full sm:w-auto" v-model="tab" :items="tabs" />
    </UiFlex>
    
    <div class="grid grid-cols-12 gap-2">
      <UCard class="lg:col-span-4 sm:col-span-12 col-span-12" :ui="{ body: { padding: 'px-4 md:px-8 py-6 md:py-8' } }">
        <UiFlex justify="between">
          <UAvatar icon="i-bx-money-withdraw" size="2xl" class="mr-4" />
          <UiFlex type="col" items="end">
            <UiText color="gray" align="end">{{ t('revenue') }}</UiText>
            <USkeleton v-if="!!loading" class="w-28 h-7 md:h-8 xl:h-9" />
            <UiText v-else color="primary" align="end" weight="bold" class="text-xl md:text-2xl xl:text-3xl">{{ toMoney(data.payment) }}</UiText>
          </UiFlex>
        </UiFlex>
      </UCard>

      <UCard class="lg:col-span-4 sm:col-span-12 col-span-12" :ui="{ body: { padding: 'px-4 md:px-8 py-6 md:py-8' } }">
        <UiFlex justify="between">
          <UAvatar icon="i-bx-cart-alt" size="2xl" class="mr-4" />
          <UiFlex type="col" items="end">
            <UiText color="gray" align="end">{{ t('spend') }}</UiText>
            <USkeleton v-if="!!loading" class="w-28 h-7 md:h-8 xl:h-9" />
            <UiText v-else color="rose" align="end" weight="bold" class="text-xl md:text-2xl xl:text-3xl">- {{ toMoney(data.spend) }}</UiText>
          </UiFlex>
        </UiFlex>
      </UCard>

      <UCard class="lg:col-span-4 sm:col-span-12 col-span-12" :ui="{ body: { padding: 'px-4 md:px-8 py-6 md:py-8' } }">
        <UiFlex justify="between">
          <UAvatar icon="i-bxs-dollar-circle" size="2xl" class="mr-4" />
          <UiFlex type="col" items="end">
            <UiText color="gray" align="end">{{ t('profit') }}</UiText>
            <USkeleton v-if="!!loading" class="w-28 h-7 md:h-8 xl:h-9" />
            <UiText v-else color="green" align="end" weight="bold" class="text-xl md:text-2xl xl:text-3xl">+ {{ toMoney(data.payment - data.spend) }}</UiText>
          </UiFlex>
        </UiFlex>
      </UCard>

      <UCard class="lg:col-span-4 sm:col-span-6 col-span-12" :ui="{ body: { padding: 'px-4 md:px-8 py-6 md:py-8' } }">
        <UiFlex justify="between">
          <UAvatar icon="i-bxs-face" size="2xl" class="mr-4" />
          <UiFlex type="col" items="end">
            <UiText color="gray" align="end">{{ t('login') }}</UiText>
            <USkeleton v-if="!!loading" class="w-28 h-7 md:h-8 xl:h-9" />
            <UiText v-else color="primary" align="end" weight="bold" class="text-xl md:text-2xl xl:text-3xl">{{ toMoney(data.signin) }}</UiText>
          </UiFlex>
        </UiFlex>
      </UCard>

      <UCard class="lg:col-span-4 sm:col-span-6 col-span-12" :ui="{ body: { padding: 'px-4 md:px-8 py-6 md:py-8' } }">
        <UiFlex justify="between">
          <UAvatar icon="i-bxs-user-plus" size="2xl" class="mr-4" />
          <UiFlex type="col" items="end">
            <UiText color="gray" align="end">{{ t('register') }}</UiText>
            <USkeleton v-if="!!loading" class="w-28 h-7 md:h-8 xl:h-9" />
            <UiText v-else color="primary" align="end" weight="bold" class="text-xl md:text-2xl xl:text-3xl">{{ toMoney(data.signup) }}</UiText>
          </UiFlex>
        </UiFlex>
      </UCard>

      <UCard class="lg:col-span-4 sm:col-span-6 col-span-12" :ui="{ body: { padding: 'px-4 md:px-8 py-6 md:py-8' } }">
        <UiFlex justify="between">
          <UAvatar icon="i-bxs-user-account" size="2xl" class="mr-4" />
          <UiFlex type="col" items="end">
            <UiText color="gray" align="end">{{ t('online') }}</UiText>
            <USkeleton v-if="!!loading" class="w-28 h-7 md:h-8 xl:h-9" />
            <UiText v-else color="primary" align="end" weight="bold" class="text-xl md:text-2xl xl:text-3xl">{{ toMoney(socketStore.online) }}</UiText>
          </UiFlex>
        </UiFlex>
      </UCard>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
const { toMoney } = useMoney()
const socketStore = useSocketStore()

const loading = ref(false)
const tab = ref(0)
const tabs = [
  { label: t('today') }, 
  { label: t('yesterday') }, 
  { label: t('month') }, 
  { label: t('lastmonth') }, 
  { label: t('total') }
]
watch(tab, () => getData())

const data = ref({
  payment: 0,
  spend: 0,
  signin: 0,
  signup: 0
})

const type = computed(() => {
  if(tab.value == 0) return 'today'
  if(tab.value == 1) return 'yesterday'
  if(tab.value == 2) return 'month'
  if(tab.value == 3) return 'lastmonth'
  if(tab.value == 4) return 'total'
})

const getData = async () => {
  try {
    loading.value = true
    const get = await useAPI('statistic/fast', { 
      type: type.value
    })

    data.value = get
    loading.value = false
  }
  catch {
    return
  }
}

getData()
</script>