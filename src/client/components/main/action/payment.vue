<template>
  <div>
    <Transition name="page" mode="out-in">
      <DataEmpty :text="t('functionMaintenance')" class="min-h-[300px]" :loading="loading.config" v-if="!!loading.config || !config || (!!config && !!config.maintenance)"></DataEmpty>

      <UForm v-else class="@3xl:col-span-8 col-span-12" ref="form" :state="state" :validate="validate" @submit="submit">
        <div v-if="!!gateSelect">
          <UiFlex type="col" class="mb-4 gap-1" v-if="!!happyhour || (!!savePayBonus && savePayBonus.number > 0)">
            <UAlert icon="i-bxs-gift" color="green" variant="outline" class="bg-card-box" v-if="(!!savePayBonus && savePayBonus.number > 0)">
              <template #description>
                <UiText v-html="info('paymentBonnusEvent', {
                  value: savePayBonus.number,
                  time: savePayBonus.time || ''
                })" />
              </template>
            </UAlert>

            <UAlert icon="i-bxs-gift" color="green" variant="outline" class="bg-card-box" v-if="!!happyhour">
              <template #description>
                <UiText v-html="info('paymentHappyHourInfo', {
                  value: happyhour.number,
                  start: happyhour.start,
                  end: happyhour.end,
                })" />
              </template>
            </UAlert>
          </UiFlex>
        </div>

        <UFormGroup label="Chọn hình thức" name="gate">
          <SelectGate auto v-model="state.gate" v-model:gate="gateSelect" />
        </UFormGroup>

        <DataEmpty class="min-h-[300px]" v-if="!gateSelect"/>
        
        <div v-else>
          <UFormGroup :label="t('promo')" v-if="!!promo && promo.number > 0">
            <UInput :model-value="`+${promo.number}% ${promo.time}`" readonly />
          </UFormGroup>

          <UFormGroup :label="t('promoPayHappyHour')" v-if="!!happyhour">
            <UInput :model-value="`+${happyhour.number}%`" readonly />
          </UFormGroup>

          <!-- QR -->
          <div v-if="gateSelect.type != 1" class="mb-2">
            <UFormGroup :label="t('paymentMoney')" name="money" v-if="!!config">
              <UInput v-model="state.money" type="number" :placeholder="t('paymentInputPlaceholderMoney', { a: useMoney().toMoney(config.min)})"/>
            </UFormGroup>

            <UFormGroup :label="t('paymentCoinReceive')" v-if="!!totalCoin">
              <UInput :model-value="`${useMoney().toMoney(totalCoin)} ${t('coin')}`" readonly />
            </UFormGroup>

            <!-- <div class="bg-card-box rounded-2xl p-4">
              <UiText color="gray" size="sm" class="mb-2" v-html="info('paymentInfoA')"></UiText>
              <UiText color="gray" size="sm" class="mb-2" v-html="info('paymentInfoA2')"></UiText>
              <UiText color="gray" size="sm" class="mb-2" v-html="info('paymentInfoB')"></UiText>
              <UiText color="gray" size="sm" v-html="info('paymentInfoC')"></UiText>
            </div> -->
          </div>

          <!-- Card -->
          <div v-if="gateSelect.type == 1" class="mb-2">
            <UFormGroup :label="t('gateCardNet')" name="card_net">
              <USelectMenu v-model="state.card.net" :options="card.net" value-attribute="value" size="lg" />
            </UFormGroup>

            <UFormGroup :label="t('gateCardMoney')" name="card_money">
              <USelectMenu v-model="state.money" :options="card.money" value-attribute="value" size="lg" />
            </UFormGroup>

            <UiFlex items="start" class="gap-1 flex-col @xl:flex-row">
              <UFormGroup :label="t('gateCardSeries')" name="card_seri" class="grow w-full">
                <UInput v-model="state.card.seri" />
              </UFormGroup>

              <UFormGroup :label="t('gateCardPin')" name="card_pin" class="grow w-full">
                <UInput v-model="state.card.pin" />
              </UFormGroup>
            </UiFlex>

            <UFormGroup :label="t('paymentCoinReceive')" name="money" v-if="!!totalCoin">
              <UInput :model-value="`${useMoney().toMoney(totalCoin)} ${t('coin')}`" readonly />
            </UFormGroup>

            <!-- <div class="bg-card-box rounded-2xl p-4">
              <UiText color="gray" size="sm" class="mb-2" v-html="info('paymentInfoA')"></UiText>
              <UiText color="gray" size="sm" class="mb-2" v-html="info('paymentInfoA2')"></UiText>
              <UiText color="gray" size="sm" class="mb-2" v-html="info('paymentInfoD')"></UiText>
              <UiText color="gray" size="sm" v-html="info('paymentInfoE')"></UiText>
            </div> -->
          </div>

          <!-- Button -->
          <UButton block type="submit" :loading="loading.create" class="bg-btn" size="lg" :disabled="!!payment">   
            {{ gateSelect.type != 1 ? t('paymentCreateQR') : t('paymentCheckCard') }}
          </UButton>
        </div>
      </UForm>
    </Transition>

    <!-- Modal View -->
    <UModal v-model="modal.payment" preventClose :ui="{width: 'sm:max-w-[370px]'}">
      <UiContent :title="t('transaction')" :sub="t('transactionSub')" class="bg-card p-4 rounded-2xl" v-if="payment">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.payment = false, reset()"></UButton>
        </template>

        <DataPaymentView :fetch-id="payment" @close="modal.payment = false, reset()" @history="modal.payment = false, modal.history = true, reset()" />
      </UiContent>
    </UModal>

    <!-- Modal History -->
    <UModal v-model="modal.history" :ui="{width: 'sm:max-w-[900px]'}">
      <UiContent :title="t('menuPaymentHistory')" :sub="t('menuPaymentHistoryInfo')" class="bg-card rounded-2xl p-4" no-dot>
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.history = false"></UButton>
        </template>

        <DataPaymentHistory />
      </UiContent>
    </UModal>
  </div>
</template>

<script setup>
const { t } = useI18n()
const { dayjs, displayFull } = useDayJs()
const authStore = useAuthStore()
const configStore = useConfigStore()

const form = ref()
const loading = ref({
  config: true,
  create: false
})

const config = ref(null)
const payment = ref(null)
const info = (key, obj) => t(key, { b1: '<b class="text-red-500">', b2: '</b>', ...obj })

// Modal
const modal = ref({
  payment: false,
  history: false
})

watch(() => modal.value.payment, (val) => {
  if(!!val) return
  payment.value = undefined
  state.value.card = {
    pin: null,
    seri: null,
    net: null
  }
  state.value.money = null
})

// State
const state = ref({
  gate: null,
  card: {
    pin: null,
    seri: null,
    net: null
  },
  money: null
})

const reset = async (reloadConfig) => {
  payment.value = null
  form.value.clear()
  state.value.card = {
    pin: null,
    seri: null,
    net: null
  }
  state.value.money = null
}

watch(() => state.value.gate, () => reset())

// Is In Time
const isInTime = (startStr, endStr) => {
  function toMinutes(hhmm) {
    const [h, m] = hhmm.split(":").map(Number)
    return h * 60 + m
  }
  
  if(!startStr || !endStr) return false
  
  const now = new Date()
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const start = toMinutes(startStr)
  const end = toMinutes(endStr)

  if (start < end) {
    return nowMinutes >= start && nowMinutes < end
  } 
  else {
    return nowMinutes >= start || nowMinutes < end
  }
} 

// Happy Hour
const happyhour = computed(() => {
  if(!config.value) return null
  if(!config.value.happyhour) return null
  if(!config.value.happyhour.number) return null
  if(config.value.happyhour.number <= 0) return null
  if(!config.value.happyhour.start || !config.value.happyhour.end) return null

  const numberFrist = !config.value.frist ? parseInt(configStore.config.promo.payment.first || 0) : 0
  const numberSecond = (!!config.value.frist && numberFrist == 0) ? (!config.value.second ? parseInt(configStore.config.promo.payment.second || 0) : 0) : 0
  if(numberFrist > 0) return null
  if(numberSecond > 0) return null

  const inTime = isInTime(config.value.happyhour.start, config.value.happyhour.end)
  if(!inTime) return null
  
  return config.value.happyhour
})

// Save Pay Bonus
const savePayBonus = computed(() => {
  if(!config.value) return null

  let number = 0
  let time = ''
  const bonus = parseInt(config.value.pay?.number || 0)
  const expired = config.value.pay?.expired || null

  if(!expired) number = bonus, time = ''
  else {
    const nowTime = dayjs(Date.now()).unix()
    const expiredTime = dayjs(expired).unix()
    if(nowTime <= expiredTime) number = bonus, time = `${t('toDate')} ${displayFull(expired)}`
    else number = 0, time = ''
  }

  return { number, time }
})

// Gate
const gateSelect = ref(undefined)

const gateBonus = computed(() => {
  if(!gateSelect.value) return null
  if(!gateSelect.value['bonus']) return null

  const bonus = gateSelect.value['bonus']
  const defaultBonus = parseInt(bonus.default || 0)
  const limitBonus = parseInt(bonus.limit?.number || 0)
  const limitExpired = bonus.limit?.expired || null
  let number, time

  if(limitBonus < 1 || (limitBonus > 0 && !limitExpired)) {
    number = defaultBonus
    time = ''
  }
  else {
    const now = dayjs(Date.now()).unix()
    const expired = dayjs(limitExpired).unix()
    if(now <= expired) {
      number = limitBonus
      time = `${t('toDate')} ${displayFull(limitExpired)}`
    }
    else {
      number = defaultBonus
      time = ''
    }
  }

  return { number, time }
})

// Promo
const promo = computed(() => {
  if(!gateBonus.value) return null

  const numberFrist = !config.value.frist ? parseInt(configStore.config.promo.payment.first || 0) : 0
  const numberSecond = (!!config.value.frist && numberFrist == 0) ? (!config.value.second ? parseInt(configStore.config.promo.payment.second || 0) : 0) : 0
  if(numberFrist > 0) return { number: numberFrist, time: t('promoPayFrist') }
  if(numberSecond > 0) return { number: numberSecond, time: t('promoPaySecond') }
  return gateBonus.value
})

// Total Coin
const totalCoin = computed(() => {
  if(!config.value) return null
  if(!promo.value) return null
  if(!state.value.money) return null
  if(state.value.money < config.value.min) return null

  const coin = state.value.money
  const bonusPromo = promo.value.number || 0
  const bonusHappyHour = happyhour.value ? happyhour.value.number : 0
  const totalBonus = bonusPromo + bonusHappyHour
  const coinBonus = Math.floor((parseInt(state.value.money) * parseInt(totalBonus)) / 100)
  return coin + coinBonus
})

// Card
const card = {
  net:  [
    { label: 'Viettel', value: 'VIETTEL' },
    { label: 'Mobifone', value: 'MOBIPHONE' },
    { label: 'Vinaphone', value: 'VINAPHONE' },
  ],
  money: [
    // { label: '10.000', value: 10000 },
    { label: '20.000', value: 20000 },
    { label: '30.000', value: 30000 },
    { label: '50.000', value: 50000 },
    { label: '100.000', value: 100000 },
    { label: '200.000', value: 200000 },
    { label: '300.000', value: 300000 },
    { label: '500.000', value: 500000 },
    { label: '1.000.000', value: 1000000 },
  ]
}

// Validate
const validate = (st) => {
  const errors = []
  if (!st.gate) errors.push({ path: 'gate', message: t('errorSelectGate') })
  if (!!gateSelect.value) {
    if(gateSelect.value['type'] == 1){
      if (!st.money) errors.push({ path: 'card_money', message: t('errorInputEmpty') })
      if (!st.card.net) errors.push({ path: 'card_net', message: t('errorInputEmpty') })
      if (!st.card.seri) errors.push({ path: 'card_seri', message: t('errorInputEmpty') })
      if (!st.card.pin) errors.push({ path: 'card_pin', message: t('errorInputEmpty') })
    }
    if(gateSelect.value['type'] != 1){
      if (!st.money) errors.push({ path: 'money', message: t('errorInputEmpty') })
    }
  }
  return errors
}

// Get Config
const getConfig = async () => {
  try {
    loading.value.config = true
    const data = await useAPI('payment/public/config')
    
    config.value = data
    setTimeout(() => loading.value.config = false)
  }
  catch (e) {
    config.value = null
    setTimeout(() => loading.value.config = false)
  }
}

// Submit
const submit = async () => {
  try {
    if(!authStore.isLogin) return useNotify().error(t('errorAuthEmpty'))
    loading.value.create = true
    const pay = await useAPI('payment/public/create', state.value)

    payment.value = pay
    modal.value.payment = true
    loading.value.create = false
  }
  catch (e) {
    loading.value.create = false
  }
}

getConfig()
watch(() => authStore.isLogin, () => getConfig())
</script>