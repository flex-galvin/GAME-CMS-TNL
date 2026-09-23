<template>
  <UiContent :title="t('limitedPayReceive')" :sub="t('limitedPayReceiveSub')" class="LimitedPay rounded-2xl p-4">
    <UiIcon name="i-bx-x" size="8" class="limited-pay-text-2 absolute top-2 right-2 cursor-pointer z-1" @click="emits('close')" />

    <UForm :state="state" @submit="submit">
      <UFormGroup :label="t('limitedPayNeed')" v-if="!!award">
        <UInput :model-value="`${useMoney().toMoney(award.step)} VNĐ`" readonly />
      </UFormGroup>

      <UFormGroup :label="t('server')">
        <SelectGameServer v-model="state.server" />
      </UFormGroup>

      <UFormGroup :label="t('role')" v-if="state.server" >
        <SelectGameRole v-model="state.role" :server="state.server" />
      </UFormGroup>

      <UFormGroup :label="t('award')" v-if="!!award">
        <div class="bg-card-box rounded-2xl p-4">
          <DataItemList :items="award.gift" justify="center" :size="50"/>
        </div>
      </UFormGroup>

      <UiFlex justify="end" class="gap-1">
        <UButton class="limited-pay-btn" @click="submit" :loading="loading" v-if="!!isActive">{{ t('confirm') }}</UButton>
        <UButton color="gray" :disabled="loading" @click="emits('close')">{{ t('close') }}</UButton>
      </UiFlex>
    </UForm>
  </UiContent>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps(['award'])
const emits = defineEmits(['done', 'close'])

const loading = ref(false)

const state = ref({
  server: null,
  role: null,
  money: null
})

const isActive = computed(() => {
  if(!state.value.server) return false
  if(!state.value.role) return false
  return true
})

const submit = async () => {
  try {
    loading.value = true

    state.value.money = props.award.step
    await useAPI('limited/pay/public/receive', state.value)

    loading.value = false
    emits('done')
  }
  catch (e) {
    loading.value = false
  }
}
</script>