<template>
  <div>
    <DataEmpty :loading="loading" v-if="!!loading || !payment"/>

    <div v-else>
      <UiFlex justify="center" type="col" class="mb-2" v-if="!isExpired && !!countdown && (!!payment.gate && payment.gate.type != 1)">
        <UiText size="sm" weight="semibold" color="green">{{ t('paymentTimeLeft') }}</UiText>
        <UiText align="center" class="text-5xl" weight="bold">
          <UiCountdown :time="countdown" @end="fetch"></UiCountdown>
        </UiText>
      </UiFlex>

      <UiFlex justify="center" type="col" class="mb-4 gap-4" v-if="!!payment.qrcode">
        <img :src="payment.qrcode" width="200" class="md:max-w-[200px]" v-if="!isExpired || (!!isExpired && !!authStore.profile && authStore.profile.type > 0)"/>

        <UiText size="sm" weight="semibold" color="red" class="px-6" align="center" v-if="!isExpired">
          {{ t('paymentWrongMoneyWarning') }}
        </UiText>
        <UiText size="sm" weight="semibold" color="red" class="px-6" align="center" v-if="!!isExpired">
          {{ t('paymentExpiredWarning') }}
        </UiText>
      </UiFlex>

      <UCard :ui="{ body: { padding: 'p-4 sm:p-4'}}" class="mb-4">
        <UiFlex justify="between" class="mb-3">
          <UiText size="xs" weight="semibold" color="gray">{{ t('moneyAmount') }}</UiText>
          <UiText size="sm" weight="bold">{{ payment.money ? toMoney(payment.money) : 0 }}</UiText>
        </UiFlex>
        <UiFlex justify="between">
          <UiText size="xs" weight="semibold" color="gray">{{ t('gate') }}</UiText>
          <UiText size="sm" weight="bold">{{ payment.channel?.name || '...' }}</UiText>
        </UiFlex>
      </UCard>

      <div v-if="payment.gate.type != 1">
        <UiFlex justify="between" class="mb-4">
          <div>
            <UiText size="xs" weight="semibold" color="gray" class="mb-1.5">{{ t('gateBankPerson') }}</UiText>
            <UiText size="sm" weight="bold">{{ payment.channel ? payment.channel?.person || '...' : payment.gate?.person || '...' }}</UiText>
          </div>
          <UButton color="gray" size="xs" @click="startCopy(payment.channel ? payment.channel?.person : payment.gate?.person)">{{ t('copy') }}</UButton>
        </UiFlex>

        <UiFlex justify="between" class="mb-4">
          <div>
            <UiText size="xs" weight="semibold" color="gray" class="mb-1.5">{{ t('gateBankNumber') }}</UiText>
            <UiText size="sm" weight="bold">{{ payment.channel ? payment.channel?.number || '...' : payment.gate?.number || '...' }}</UiText>
          </div>
          <UButton color="gray" size="xs" @click="startCopy(payment.channel ? payment.channel?.number : payment.gate?.number)">{{ t('copy') }}</UButton>
        </UiFlex>

        <UiFlex justify="between">
          <div>
            <UiText size="xs" weight="semibold" color="gray" class="mb-1.5">{{ t('gateBankContent') }}</UiText>
            <UiText size="sm" weight="bold">{{ payment.channel ? payment.channel?.content : payment.code }}</UiText>
          </div>
          <UButton color="gray" size="xs" @click="startCopy(payment.channel ? payment.channel?.content : payment.code)">{{ t('copy') }}</UButton>
        </UiFlex>
      </div>

      <div v-if="payment.gate.type == 1">
        <UiFlex justify="between" class="mb-4">
          <div>
            <UiText size="xs" weight="semibold" color="gray" class="mb-1.5">{{ t('gateCardNet') }}</UiText>
            <UiText size="sm" weight="bold">{{ payment.card?.net || '...' }}</UiText>
          </div>
          <UButton color="gray" size="xs" @click="startCopy(payment.card?.net)">{{ t('copy') }}</UButton>
        </UiFlex>

        <UiFlex justify="between" class="mb-4">
          <div>
            <UiText size="xs" weight="semibold" color="gray" class="mb-1.5">{{ t('gateCardSeries') }}</UiText>
            <UiText size="sm" weight="bold">{{ payment.card?.seri || '...' }}</UiText>
          </div>
          <UButton color="gray" size="xs" @click="startCopy(payment.card?.seri)">{{ t('copy') }}</UButton>
        </UiFlex>

        <UiFlex justify="between" class="mb-4">
          <div>
            <UiText size="xs" weight="semibold" color="gray" class="mb-1.5">{{ t('gateCardPin') }}</UiText>
            <UiText size="sm" weight="bold">{{ payment.card?.pin || '...' }}</UiText>
          </div>
          <UButton color="gray" size="xs" @click="startCopy(payment.card?.pin)">{{ t('copy') }}</UButton>
        </UiFlex>
      </div>

      <UButton block class="bg-btn mt-4" size="lg" @click="emits('history')" v-if="!noHistory">{{ t('checkPaymentsHistory') }}</UButton>
    </div>
  </div>
</template>

<script setup>
import { useClipboard } from '@vueuse/core'
const { copy, isSupported } = useClipboard()
const { toMoney } = useMoney()
const { t } = useI18n()
const { dayjs } = useDayJs()
const authStore = useAuthStore()
const props = defineProps(['fetchId', 'noHistory'])
const emits = defineEmits(['history', 'close'])

const loading = ref(true)
const payment = ref(undefined)
const countdown = ref()

const isExpired = computed(() => {
  if(!countdown.value) return true
  const nTime = dayjs().unix()
  const cTime = dayjs(countdown.value).unix()
  return cTime < nTime
})

const startCopy = (text) => {
  if(!isSupported.value || !text) return
  copy(text)
  useNotify().success(t('copySuccess'))
}

const fetch = async () => {
  try {
    const data = await useAPI('payment/public/get', { 
      _id: props.fetchId
    })
    payment.value = data
    countdown.value = dayjs(payment.value.createdAt).add(5, 'minute')
    loading.value = false
  }
  catch (e) {
    loading.value = false
  }
}

onMounted(() => setTimeout(fetch, 1))
</script>