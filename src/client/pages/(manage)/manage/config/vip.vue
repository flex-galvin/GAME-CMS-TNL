<template>
  <UiContent :title="t('menuManageConfigVip')" :sub="t('menuManageConfigVipInfo')" class="max-w-3xl mx-auto">
    <UCard>
      <UForm :state="state">
        <UiFlex justify="between" class="mb-4">
          <UiText weight="semibold" size="sm">{{ t('active') }}</UiText>
          <UToggle v-model="state.menu.action.vip" />
        </UiFlex>

        <UFormGroup :label="t('menuManageConfigVipPriceWeek')">
          <UInput v-model="state.vip.price.week" type="number" />
        </UFormGroup>

        <UFormGroup :label="t('menuManageConfigVipPriceMonth')">
          <UInput v-model="state.vip.price.month" type="number" />
        </UFormGroup>

        <UFormGroup :label="t('menuManageConfigVipBonusPay')">
          <UInput v-model="state.vip.bonus.pay" type="number" />
        </UFormGroup>

        <UFormGroup :label="t('menuManageConfigVipDiscountShop')">
          <UInput v-model="state.vip.discount.shop" type="number" />
        </UFormGroup>

        <UFormGroup :label="t('menuManageConfigVipGift')">
          <SelectItemList v-model="state.vip.gift" :types="['game_item','coin','wheel']" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton class="bg-btn" @click="update('vip')" :loading="updating">{{ t('update') }}</UButton>
        </UiFlex>
      </UForm>
    </UCard>
  </UiContent>
</template>

<script setup>
const { t } = useI18n()
const { bootConfig } = useConfigStore()

const load = ref(true)
const updating = ref(false)

const state = ref({
  change: null,

  menu: {
    action: {
      vip: false
    },
  },

  vip: {
    price: {
      week: null,
      month: null
    },
    gift: [],
    bonus: {
      pay: null
    },
    discount: {
      shop: null
    }
  }
})

const getConfig = async () => {
  const config = await useAPI('config/manage/get')
  state.value = Object.assign(state.value, config)
  load.value = false
}

const update = async (change) => {
  try {
    updating.value = true
    state.value.change = change

    await useAPI('config/manage/update', state.value)
    bootConfig()
    getConfig()
    updating.value = false
  }
  catch(e) {
    updating.value = false
  }
}

getConfig()
</script>