<template>
  <UiContent :title="t('limitedHalloweenPumpkinReceive')" :sub="t('limitedHalloweenPumpkinReceiveSub')" class="Halloween rounded-2xl p-4" v-if="reward">
    <UiIcon name="i-bx-x" size="8" class="halloween-text absolute top-2 right-2 cursor-pointer z-1" @click="emits('close')" />

    <UForm :state="state" @submit="submit" >
      <UFormGroup :label="t('select')" >
        <UInput :model-value="reward.item_name" readonly />
      </UFormGroup>

      <UFormGroup :label="t('server')">
        <SelectGameServer v-model="state.server" />
      </UFormGroup>

      <UFormGroup :label="t('role')" v-if="state.server" >
        <SelectGameRole v-model="state.role" :server="state.server" />
      </UFormGroup>

      <UiFlex justify="end" class="gap-1">
        <UButton class="halloween-btn-2" @click="submit" :loading="loading" v-if="!!isActive">{{ t('confirm') }}</UButton>
        <UButton color="gray" :disabled="loading" @click="emits('close')">{{ t('close') }}</UButton>
      </UiFlex>
    </UForm>
  </UiContent>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps(['reward'])
const emits = defineEmits(['done', 'close'])

const loading = ref(false)

const state = ref({
  server: null,
  role: null,
  reward: props.reward ? props.reward._id : null,
})

const isActive = computed(() => {
  if(!state.value.server) return false
  if(!state.value.role) return false
  if(!state.value.reward) return false
  return true
})

const submit = async () => {
  try {
    if(!!loading.value) return 
    loading.value = true
    const data = await useAPI('limited/halloween/public/pumpkin/select', state.value)

    if(data == 'FAIL') useNotify().error(t('limitedHalloweenPumpkinPlayLose'))
    else if(data == 'TRUE') useNotify().success(t('limitedHalloweenPumpkinPlayWin'))
    else useNotify().error(t('limitedHalloweenPumpkinPlayError'))

    loading.value = false
    emits('done')
  }
  catch (e) {
    loading.value = false
  }
}
</script>