<template>
  <UiContent :title="t('menuManageConfigPromo')" :sub="t('menuManageConfigPromoInfo')" class="max-w-3xl mx-auto">
    <UAccordion
      color="primary"
      variant="soft"
      size="md"
      :items="menu"
    >
      <template #default="{ item, open }">
        <UButton size="md" class="bg-card-box mb-1">
          <UiText class="text-white" :class="{
            '!text-gray-400': !open,
            '!text-primary-400': !!open
          }">{{ item.label }}</UiText>
        </UButton>
      </template>

      <template #promo>
        <UForm class="bg-card-box p-4 rounded-2xl" :state="stateConfig">
          <UFormGroup :label="t('promoRegisterInfo')">
            <UInput v-model="stateConfig.promo.register.coin" />
          </UFormGroup>

          <UFormGroup :label="t('promoPayFristInfo')">
            <UInput v-model="stateConfig.promo.payment.first" />
          </UFormGroup>

          <UFormGroup :label="t('promoPaySecondInfo')">
            <UInput v-model="stateConfig.promo.payment.second" />
          </UFormGroup>

          <UiFlex justify="end">
            <UButton class="bg-btn" @click="updateConfig('promo')" :loading="updating">{{ t('update') }}</UButton>
          </UiFlex>
        </UForm>
      </template>

      <template #payment>
        <UForm class="bg-card-box p-4 rounded-2xl" :state="statePayment" @submit="updatePayment">
          <UFormGroup :label="t('managePaymentMoneyMin')">
            <UInput v-model="statePayment.min" type="number" />
          </UFormGroup>

          <UFormGroup :label="t('bonusSavePay')">
            <UiFlex class="gap-1">
              <UInput v-model="statePayment.pay.number" type="number" class="grow" />
              <SelectDate v-model="statePayment.pay.expired" time class="grow" />
            </UiFlex>
          </UFormGroup>

          <UFormGroup :label="t('paymentHappyHour')">
            <UInput v-model="statePayment.happyhour.number" :placeholder="t('value')" type="number" />
            <UiFlex class="gap-1 mt-1">
              <UInput v-model="statePayment.happyhour.start" :placeholder="t('start')" type="time" class="grow" />
              <UInput v-model="statePayment.happyhour.end" :placeholder="t('end')" type="time" class="grow" />
            </UiFlex>
          </UFormGroup>

          <UiFlex>
            <UToggle v-model="statePayment.maintenance" :disabled="!!updating" />
            <UiText size="sm" class="ml-2 mr-auto">{{ t('maintenance') }}</UiText>

            <UButton type="submit" class="bg-btn" :loading="updating">{{ t('update') }}</UButton>
          </UiFlex>
        </UForm>
      </template>

      <template #shop>
        <UForm class="bg-card-box p-4 rounded-2xl" :state="stateShop" @submit="updateShop">
          <UFormGroup :label="t('discountShop')">
            <UiFlex class="gap-1">
              <UInput v-model="stateShop.discount.number" type="number" class="grow" />
              <SelectDate v-model="stateShop.discount.expired" time class="grow" />
            </UiFlex>
          </UFormGroup>

          <UiFlex>
            <UToggle v-model="stateShop.maintenance" :disabled="!!updating" />
            <UiText size="sm" class="ml-2 mr-auto">{{ t('maintenance') }}</UiText>

            <UButton type="submit" class="bg-btn" :loading="updating">{{ t('update') }}</UButton>
          </UiFlex>
        </UForm>
      </template>
    </UAccordion>
  </UiContent>
</template>

<script setup>
const { t } = useI18n()

const load = ref(true)
const updating = ref(false)

const menu = computed(() => [
  { label: t('home'), slot: 'promo' },
  { label: t('menuPayment'), slot: 'payment' },
  { label: t('menuShop'), slot: 'shop' },
])

const stateConfig = ref({
  change: null,

  promo: {
    register: {
      coin: 0
    },
    payment: {
      first: 0,
      second: 0
    }
  }
})

const statePayment = ref({
  maintenance: null,
  pay: {
    number: null,
    expired: null
  },
  min: null,
  happyhour: {
    start: null,
    end: null,
    number: null,
  }
})

const stateShop = ref({
  maintenance: null,
  discount: {
    number: null,
    expired: null
  }
})

const getConfig = async () => {
  const config = await useAPI('config/manage/get')
  const configPayment = await useAPI('payment/manage/config/get')
  const configShop = await useAPI('shop/config/manage/get')
  stateConfig.value = Object.assign(stateConfig.value, config)
  statePayment.value = Object.assign(statePayment.value, configPayment)
  stateShop.value = Object.assign(stateShop.value, configShop)
  load.value = false
}

const updateConfig = async (change) => {
  try {
    updating.value = true
    stateConfig.value.change = change

    await useAPI('config/manage/update', stateConfig.value)
    bootConfig()
    getConfig()
    updating.value = false
  }
  catch(e) {
    updating.value = false
  }
}

const updatePayment = async () => {
  try {
    updating.value = true
    await useAPI('payment/manage/config/update', statePayment.value)

    getConfig()
    updating.value = false
  }
  catch (e) {
    updating.value = false
  }
}

const updateShop = async () => {
  try {
    updating.value = true
    await useAPI('shop/config/manage/update', stateShop.value)

    getConfig()
    updating.value = false
  }
  catch (e) {
    updating.value = false
  }
}

getConfig()
</script>