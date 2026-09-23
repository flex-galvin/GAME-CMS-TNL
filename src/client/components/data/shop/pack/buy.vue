<template>
  <UiContent no-dot :title="t('shopPackBuy')" :sub="t('shopPackBuySub')" class="bg-card rounded-2xl p-4">
    <template #more>
      <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square :disabled="!!buying" @click="emits('close')"></UButton>
    </template>
    
    <LoadingTable v-if="!!load" />

    <!--Maintenance-->
    <div v-if="!load && !!config.maintenance">
      <DataEmpty :text="t('shopMaintenance')" icon="i-bx-shopping-bag" />

      <UiFlex justify="end" class="mt-4">
        <UButton color="gray" @click="emits('close')">{{ t('close') }}</UButton>
      </UiFlex>
    </div>

    <!-- Form -->
    <UForm :state="state" :validate="validate" @submit="submit" v-if="!load && !config.maintenance">
      <UFormGroup :label="t('server')" name="server">
        <SelectGameServer v-model="state.server" />
      </UFormGroup>

      <UFormGroup :label="t('role')" name="role" v-if="!!state.server">
        <SelectGameRole v-model="state.role" :server="state.server" />
      </UFormGroup>

      <UFormGroup :label="t('currency')" name="money">
        <template #hint>
          <DataUserCoin size="xs" v-if="state.money == 'coin'" />
          <DataUserDiamond size="xs" v-if="state.money == 'diamond'" />
        </template>

        <SelectMoney v-model="state.money" />
      </UFormGroup>

      <UFormGroup :label="t('amount')" name="amount" v-if="!!pack && !!pack.gift">
        <UInput v-model="state.amount" type="number" />
      </UFormGroup>

      <UFormGroup :label="t('packInfo')" name="gift" v-if="!!pack && !!pack.gift">
        <div class="bg-card-box rounded-2xl p-4">
          <DataItemList justify="center" :items="pack.gift" />
        </div>
      </UFormGroup>

      <UFormGroup :label="t('description')" v-if="!!pack && (!!pack.description && pack.description != '<p></p>')">
        <UCard class="bg-card-box" :ui="{ body: { padding: 'p-4 sm:p-4' } }">
          <UiEditorContent :content="pack.description" class="text-xs text-gray-400" />
        </UCard>
      </UFormGroup>

      <UFormGroup :label="t('detailedInformation')" name="info" v-if="!!pack && !!level && !!currency">
         <UCard class="bg-card-box" :ui="{ body: { padding: 'p-2 sm:p-2' } }">
          <UiFlex justify="between" class="text-xs sm:text-sm font-semibold p-2 gap-10">
            <UiText color="gray" class="min-w-[100px]">{{ t('pack') }}</UiText>
            <UiText align="end">{{ pack.name }}</UiText>
          </UiFlex>

          <UiFlex justify="between" class="text-xs sm:text-sm font-semibold p-2 gap-10" v-if="pack.limit > 0">
            <UiText color="gray" class="min-w-[100px]">{{ t('limited') }}</UiText>
            <UiText align="end">{{ pack.limit }} / {{ t('day') }}</UiText>
          </UiFlex>

          <UiFlex justify="between" class="text-xs sm:text-sm font-semibold p-2 gap-10" v-if="!!pack.servers">
            <UiText color="gray" class="min-w-[100px]">{{ t('server') }}</UiText>
            <UiText align="end">{{ pack.servers.length > 0 ? pack.servers.join(' | ') : t('all') }}</UiText>
          </UiFlex>

          <UiFlex justify="between" class="text-xs sm:text-sm font-semibold p-2 gap-10">
            <UiText color="gray" class="min-w-[100px]">{{ t('unitPrice') }}</UiText>
            <UiText align="end">{{ toMoney(pack.price) }}</UiText>
          </UiFlex>

          <UiFlex justify="between" class="text-xs sm:text-sm font-semibold p-2 gap-10">
            <UiText color="gray" class="min-w-[100px]">{{ t('amount') }}</UiText>
            <UiText align="end">x{{ state.amount }}</UiText>
          </UiFlex>

          <UiFlex justify="between" class="text-xs sm:text-sm font-semibold p-2 gap-10" v-if="vipDiscount > 0">
            <UiText color="gray" class="min-w-[100px]">{{ t('discountVIP') }}</UiText>
            <UiText color="rose" align="end">- {{ `${vipDiscount}%` }}</UiText>
          </UiFlex>

          <UiFlex justify="between" class="text-xs sm:text-sm font-semibold p-2 gap-10" v-if="level.discount && level.discount > 0">
            <UiText color="gray" class="min-w-[100px]">{{ t('discountLevel') }}</UiText>
            <UiText color="rose" align="end">- {{ `${level.discount}%` }}</UiText>
          </UiFlex>

          <UiFlex justify="between" class="text-xs sm:text-sm font-semibold p-2 gap-10" v-if="systemDiscount && systemDiscount.number > 0">
            <UiText color="gray" class="min-w-[100px]">{{ t('discountShop') }}</UiText>
            <UiText color="rose" align="end">- {{ `${systemDiscount.number}%` }}</UiText>
          </UiFlex>

          <UiFlex justify="between" class="text-xs sm:text-sm font-semibold p-2 gap-10" v-if="totalPrice != null">
            <UiText color="gray" class="min-w-[100px]">{{ t('totalPrice') }}</UiText>
            <UiText color="primary" weight="bold" align="end">{{ toMoney(totalPrice) }}</UiText>
          </UiFlex>
        </UCard>
      </UFormGroup>

      <UiFlex class="gap-1" justify="end">
        <UButton class="bg-btn" type="submit" :loading="buying">{{ t('buy') }}</UButton>
        <UButton color="gray" :disabled="buying" @click="emits('close')">{{ t('close') }}</UButton>
      </UiFlex>
    </UForm>
  </UiContent>
</template>

<script setup>
const { t } = useI18n()
const { dayjs, displayFull } = useDayJs()
const { toMoney } = useMoney()
const authStore = useAuthStore()
const configStore = useConfigStore()

const props = defineProps(['pack', 'server'])
const emits = defineEmits(['close', 'done'])

const load = ref(true)
const config = ref({
  maintenance: true,
  discount: {
    number: null,
    expired: null
  }
})

const buying = ref(false)

const level = computed(() => authStore.profile.level)
const currency = computed(() => authStore.profile.currency)

const state = ref({
  server: props.server ? props.server : null,
  role: null,
  pack: props.pack ? props.pack._id : null,
  amount: 1,
  money: 'coin'
})

const vipDiscount = computed(() => {
  if(!authStore.profile.vip) return 0
  if(!authStore.profile.vip.enable) return 0
  if(authStore.profile.vip.type == 'forever') return configStore.config.vip.discount.shop || 0
  if(authStore.profile.vip.type == 'day'){
    if(!authStore.profile.vip.end) return 0

    const nowTime = dayjs(Date.now()).unix()
    const expiredTime = dayjs(authStore.profile.vip.end).unix()
    if(nowTime <= expiredTime) return configStore.config.vip.discount.shop || 0
    return 0
  }
  return 0
})

const systemDiscount = computed(() => {
  let number = 0
  let time = ''
  const discount = parseInt(config.value.discount.number || 0)
  const expired = config.value.discount.expired || null

  if(!expired) number = discount, time = ''
  else {
    const nowTime = dayjs(Date.now()).unix()
    const expiredTime = dayjs(expired).unix()
    if(nowTime <= expiredTime) number = discount, time = `${t('toDate')} ${displayFull(expired)}`
    else number = 0, time = ''
  }

  return { number, time }
})

const totalPrice = computed(() => {
  const amount = state.value.amount
  const price = props.pack ? props.pack?.price : 0
  const discount_level = level.value ? level.value.discount : 0
  const discount_system = systemDiscount.value.number
  const discount_vip = vipDiscount.value

  if(!amount || amount < 1) return null
  if(!price || price < 1) return null
  if(discount_level === undefined || discount_level < 0) return null

  let discount = discount_level + discount_system + discount_vip
  discount = discount > 100 ? 100 : discount

  let total = Math.floor(amount * price)
  total = total - Math.floor(total * discount / 100)
  return total
})

const validate = (state) => {
  const errors = []
  if (totalPrice.value == null) errors.push({ path: 'info', message: t('errorTotalPrice') })
  else if (totalPrice.value != null && currency.value[`${state.money}`] < totalPrice.value) errors.push({ path: 'money', message: t('errorInsufficientBalance') })
  if (!state.server) errors.push({ path: 'server', message: t('errorSelectServer') })
  if (!state.role) errors.push({ path: 'role', message: t('errorSelectRole') })
  if (!state.amount) errors.push({ path: 'amount', message: t('errorInputEmpty') })
  else if (state.amount < 1) errors.push({ path: 'amount', message: t('errorInputAmount') })
  return errors
}

const submit = async () => {
  try {
    buying.value = true
    const data = await useAPI('shop/pack/public/buy', state.value)

    buying.value = false
    emits('done', data)
    emits('close')
  }
  catch (e) {
    buying.value = false
  }
}

const getConfig = async () => {
  try {
    load.value = true

    const data = await useAPI('shop/config/public/get')
    config.value = Object.assign(config.value, data)

    load.value = false
  }
  catch (e) {
    load.value = false
  }
}
getConfig()
</script>