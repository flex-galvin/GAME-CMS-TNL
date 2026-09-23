<template>
  <UiContent :title="t('menuGiftcode')" :sub="t('menuGiftcodeInfo')" class="bg-card rounded-2xl p-4">
    <template #more>
      <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="emits('close')"></UButton>
    </template>
    
    <UForm :state="state" @submit="submit" v-if="!!giftcode">
      <UFormGroup :label="t('server')">
        <SelectGameServer v-model="state.server" />
      </UFormGroup>

      <UFormGroup :label="t('role')" v-if="state.server" >
        <SelectGameRole v-model="state.role" :server="state.server" />
      </UFormGroup>

      <UFormGroup :label="t('code')">
        <UInput :model-value="giftcode.code" readonly />
      </UFormGroup>

      <UFormGroup :label="t('limited')">
        <UInput :model-value="giftcode.limit == 0 ? t('unlimited') : `${giftcode.limit} ${t('people')}`" readonly />
      </UFormGroup>

      <UFormGroup :label="t('use')">
        <UInput :model-value="!!giftcode.justone ? t('oneTimeOnly') : t('onePerServer')" readonly />
      </UFormGroup>

      <UFormGroup :label="t('award')">
        <div class="bg-card-box rounded-2xl p-4">
          <DataItemList :items="giftcode.gift" class="justify-center" v-if="!giftcode.hidegift" />
          <UiText color="gray" align="center" v-else>Quà tặng bị ẩn, nhận vào hòm thư để xem</UiText>
        </div>
      </UFormGroup>

      <UiFlex justify="end" class="gap-1">
        <UButton class="bg-btn" @click="submit" :loading="loading" v-if="!!isActive">{{ t('receiveReward') }}</UButton>
        <UButton color="gray" :disabled="loading" @click="emits('close')">{{ t('close') }}</UButton>
      </UiFlex>
    </UForm>
  </UiContent>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps(['giftcode', 'server'])
const emits = defineEmits(['done', 'close'])

const loading = ref(false)

const state = ref({
  server: props.server || null,
  role: null,
  giftcode: props.giftcode ? props.giftcode._id : null,
})

const isActive = computed(() => {
  if(!state.value.server) return false
  if(!state.value.role) return false
  return true
})

const submit = async () => {
  try {
    loading.value = true
    await useAPI('giftcode/public/receive', state.value)

    setTimeout(() => {
      loading.value = false
      emits('done')
    }, 1000);
  }
  catch (e) {
    loading.value = false
  }
}
</script>