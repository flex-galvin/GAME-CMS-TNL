<template>
  <div>
    <DataEmpty text="Hiện chưa có khuyến mãi nào" class="min-h-[300px]" v-if="!active" />

    <UiFlex class="@container gap-1 overflow-hidden w-full" type="col" v-else >
      <DataPromoRegisterCoin :data="promo.register.coin" v-if="!!isActiveRegisterCoin" />
      <DataPromoPaymentFrist :data="promo.payment.first" v-if="!!isActivePaymentFirst" />
      <DataPromoPaymentSecond :data="promo.payment.second" v-if="!!isActivePaymentSecond" /> 
      <DataPromoPaymentHappyhour :data="promo.payment.happyhour" v-if="!!isActivePaymentHappyHour" />
      <DataPromoShopDiscount :data="promo.shop.discount.number" v-if="!!isActiveShopDiscount" />
    </UiFlex>
  </div>
</template>

<script setup>
const { t } = useI18n()
const { dayjs } = useDayJs()
const authStore = useAuthStore()

const promo = ref({
  register: {
    coin: 0
  },
  payment: {
    first: 0,
    second: 0,
    pay: {
      number: 0,
      expired: null
    },
    happyhour: {
      start: null,
      end: null,
      number: 0
    }
  },
  shop: {
    discount: {
      number: 0,
      expired: null
    }
  }
})

const isActiveRegisterCoin = computed(() => {
  return promo.value.register.coin > 0
})

const isActivePaymentFirst = computed(() => {
  return promo.value.payment.first > 0
})

const isActivePaymentSecond = computed(() => {
  return promo.value.payment.second > 0
})

const isActivePaymentHappyHour = computed(() => {
  if(!promo.value.payment.happyhour) return false
  if(!promo.value.payment.happyhour.start) return false
  if(!promo.value.payment.happyhour.end) return false
  return promo.value.payment.happyhour.number > 0
})

const isActivePaymentPay = computed(() => {
  if(!promo.value.payment.pay) return false
  if(!promo.value.payment.pay.expired) return promo.value.payment.pay.number > 0
  else {
    const nowTime = dayjs(Date.now()).unix()
    const expiredTime = dayjs(promo.value.payment.pay.expired).unix()
    return nowTime <= expiredTime
  }
})

const isActiveShopDiscount = computed(() => {
  if(!promo.value.shop.discount) return false
  if(!promo.value.shop.discount.expired) return promo.value.shop.discount.number > 0
  else {
    const nowTime = dayjs(Date.now()).unix()
    const expiredTime = dayjs(promo.value.shop.discount.expired).unix()
    return nowTime <= expiredTime
  }
})

const active = computed(() => {
  if(!promo.value) return false

  return !!isActiveRegisterCoin.value
  || !!isActivePaymentFirst.value
  || !!isActivePaymentSecond.value
  || !!isActivePaymentHappyHour.value
  || !!isActiveShopDiscount.value
})

const getPromo = async () => {
  try {
    const data = await useAPI('config/public/promo')
    promo.value = Object.assign(promo.value, data)
  }
  catch (e) {
    promo.value = null
  }
}

getPromo()
</script>