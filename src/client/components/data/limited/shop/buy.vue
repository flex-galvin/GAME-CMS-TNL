<template>
  <UiContent no-dot :title="t('limitedShopBuy')" :sub="t('limitedShopBuySub')" class="bg-card rounded-2xl p-4">
    <template #more>
      <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square :disabled="!!buying" @click="emits('close')"></UButton>
    </template>

    <UForm :state="state" :validate="validate" @submit="submit">
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

      <UFormGroup :label="t('award')" name="gift" v-if="!!pack && !!pack.gift">
        <div class="bg-card-box rounded-2xl p-4">
          <DataItemList justify="center" :items="pack.gift" />
        </div>
      </UFormGroup>

      <UFormGroup :label="t('detailedInformation')" name="info" v-if="!!pack && !!currency">
         <UCard class="bg-card-box" :ui="{ body: { padding: 'p-2 sm:p-2' } }">
          <UiFlex justify="between" class="text-sm font-semibold p-2">
            <UiText color="gray" class="mr-6">{{ t('pack') }}</UiText>
            <UiText align="end">{{ pack.name }}</UiText>
          </UiFlex>

          <UiFlex justify="between" class="text-sm font-semibold p-2">
            <UiText color="gray" class="mr-6">{{ t('unitPrice') }}</UiText>
            <UiText align="end">{{ toMoney(pack.price) }}</UiText>
          </UiFlex>

          <UiFlex justify="between" class="text-sm font-semibold p-2" v-if="totalPrice != null">
            <UiText color="gray" class="mr-6">{{ t('totalPrice') }}</UiText>
            <UiText color="primary" weight="bold" align="end">{{ `${toMoney(totalPrice)} ${state.money == 'coin' ? 'Xu' : 'CH'}` }}</UiText>
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
const { toMoney } = useMoney()
const authStore = useAuthStore()

const props = defineProps(['pack', 'server'])
const emits = defineEmits(['close', 'done'])

const buying = ref(false)
const currency = computed(() => authStore.profile.currency)

const state = ref({
  server: props.server ? props.server : null,
  role: null,
  pack: props.pack ? props.pack._id : null,
  money: 'coin'
})

const totalPrice = computed(() => {
  const amount = 1
  const price = props.pack ? props.pack?.price : 0
  if(!amount || amount < 1) return null
  if(!price || price < 1) return null
  let discount = 0
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
  return errors
}

const submit = async () => {
  try {
    buying.value = true
    const data = await useAPI('limited/shop/public/buy', state.value)

    buying.value = false
    emits('done', data)
    emits('close')
  }
  catch (e) {
    buying.value = false
  }
}
</script>