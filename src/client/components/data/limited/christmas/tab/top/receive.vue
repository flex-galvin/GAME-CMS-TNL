<template>
  <UiContent :title="t('limitedChristmasTopReceive')" :sub="t('limitedChristmasTopReceiveSub')" class="Christmas rounded-2xl p-4">
    <UiIcon name="i-bx-x" size="8" class="christmas-text absolute top-2 right-2 cursor-pointer z-1" @click="emits('close')" />

    <UForm :state="state" @submit="submit" >
      <UFormGroup :label="t('receiveReward')" v-if="!!reward">
        <UInput :model-value="`${t('rank')} ${reward.rank}`" readonly />
      </UFormGroup>

      <UFormGroup :label="t('server')">
        <SelectGameServer v-model="state.server" />
      </UFormGroup>

      <UFormGroup :label="t('role')" v-if="state.server" >
        <SelectGameRole v-model="state.role" :server="state.server" />
      </UFormGroup>

      <UFormGroup :label="t('award')" v-if="!!reward">
        <div class="bg-card-box rounded-2xl p-4">
          <DataItemList :items="reward.gift" class="justify-center"/>
        </div>
      </UFormGroup>

      <UiFlex justify="end" class="gap-1">
        <UButton class="christmas-btn-2" @click="submit" :loading="loading" v-if="!!isActive">{{ t('confirm') }}</UButton>
        <UButton color="gray" :disabled="loading" @click="emits('close')">{{ t('close') }}</UButton>
      </UiFlex>
    </UForm>
  </UiContent>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps(['rank'])
const configStore = useConfigStore()
const eventData = computed(() => configStore.eventLimited.christmas.data)
const emits = defineEmits(['done', 'close'])

const loading = ref(false)

const state = ref({
  server: null,
  role: null,
  rank: props.rank
})

const reward = computed(() => {
  if(!props.rank) return false
  if(!eventData.value.top.reward) return false
  if(eventData.value.top.reward.length == 0) return false

  const index = eventData.value.top.reward.findLastIndex(i => i.rank == props.rank)
  if(index < 0) return false

  return eventData.value.top.reward[index]
})

const isActive = computed(() => {
  if(!state.value.server) return false
  if(!state.value.role) return false
  if(!reward.value) return false
  return true
})

const submit = async () => {
  try {
    loading.value = true
    state.value.rank = props.rank
    await useAPI('limited/christmas/public/top/receive', state.value)

    loading.value = false
    emits('done')
  }
  catch (e) {
    loading.value = false
  }
}
</script>