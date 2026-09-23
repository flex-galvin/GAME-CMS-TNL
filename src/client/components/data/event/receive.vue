<template>
  <UiContent :title="typeFormat[event.type]" :sub="t('eventReceiveInfo')" class="bg-card rounded-2xl p-4" v-if="!!event">
    <template #more>
      <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="emits('close')"></UButton>
    </template>

    <UForm :state="state" :validate="validate" @submit="submit" >
      <UFormGroup :label="t('need')" name="event">
        <UInput :model-value="useMoney().toMoney(event.need)" readonly />
      </UFormGroup>

      <UFormGroup :label="t('server')" name="server">
        <SelectGameServer v-model="state.server" />
      </UFormGroup>

      <UFormGroup :label="t('role')" v-if="state.server" name="role">
        <SelectGameRole v-model="state.role" :server="state.server" />
      </UFormGroup>

      <UFormGroup :label="t('award')" name="gift">
        <div class="bg-card-box rounded-2xl p-4">
          <DataItemList :items="giftList" class="justify-center"/>
        </div>
      </UFormGroup>

      <UiFlex justify="end" class="gap-1">
        <UButton class="bg-btn" type="submit" :loading="loading">{{ t('receiveReward') }}</UButton>
        <UButton color="gray" :disabled="loading" @click="emits('close')">{{ t('close') }}</UButton>
      </UiFlex>
    </UForm>
  </UiContent>
</template>

<script setup>
const { t } = useI18n()

const authStore = useAuthStore()
const props = defineProps(['event'])
const emits = defineEmits(['done', 'close'])

const typeFormat = {
  'login.month': t('eventLoginMonth'),
  'login.total': t('eventLoginTotal'),
  'pay.day.money': t('eventPayDay'),
  'pay.month.money': t('eventPayMonth'),
  'pay.total.money': t('eventPayTotal'),
  'spend.day.coin': t('eventSpendDay'),
  'spend.month.coin': t('eventSpendMonth'),
  'spend.total.coin': t('eventSpendTotal'),
  'referral.count': t('eventReferralTotal'),
  'paymusty': t('eventPaymusty'),
  'paydays': t('eventPaydays')
}

const loading = ref(false)

const state = ref({
  server: null,
  role: null,
  event: props.event ? props.event._id : null,
})

const mergeGift = (listA, listB) => {
  const arrA = JSON.parse(JSON.stringify(listA))
  const arrB = JSON.parse(JSON.stringify(listB))
  const arr = arrA.concat(arrB)

  return arr.reduce((a, c) => {
    const obj = a.find((obj) => obj.item._id === c.item._id)
    if(!obj) a.push(c)
    else obj.amount += c.amount
    return a
  }, [])
}

const giftList = computed(() => {
  if(!props.event) return []
  if(!props.event.gift) return []
  if(!props.event.gift.length) return []
  if(!props.event.awardserver) return props.event.gift
  if(!props.event.awardserver.length) return props.event.gift
  if(!state.value.server) return props.event.gift

  const bonus = props.event.awardserver.filter(item =>
    item.servers.some(s => state.value.server.includes(s))
  )
  if(!bonus) return props.event.gift
  if(!bonus[0]) return props.event.gift
  if(!bonus[0].gift) return props.event.gift
  if(!bonus[0].gift.length) return props.event.gift

  return mergeGift(props.event.gift, bonus[0].gift)
})

const validate = (s) => {
  const errors = []
  if (!props.event) errors.push({ path: 'event', message: t('errorEventNotFound') })
  if (!!props.event && props.event.gift?.length == 0) errors.push({ path: 'gift', message: t('errorEmptyAward') })
  if (!s.server) errors.push({ path: 'server', message: t('errorSelectServer') })
  if (!s.role) errors.push({ path: 'role', message: t('errorSelectRole') })
  return errors
}

const submit = async () => {
  try {
    loading.value = true
    await authStore.setAuth()
    await useAPI('event/public/receive', state.value)

    loading.value = false
    emits('done')
  }
  catch (e) {
    loading.value = false
  }
}
</script>