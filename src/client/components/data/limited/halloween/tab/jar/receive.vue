<template>
  <UiContent :title="t('limitedHalloweenJarReceive')" :sub="t('limitedHalloweenJarReceiveSub')" class="Halloween rounded-2xl p-4">
    <UiIcon name="i-bx-x" size="8" class="halloween-text absolute top-2 right-2 cursor-pointer z-1" @click="emits('close')" />

    <UForm :state="state" @submit="submit" >
      <UFormGroup :label="t('server')">
        <SelectGameServer v-model="state.server" />
      </UFormGroup>

      <UFormGroup :label="t('role')" v-if="state.server" >
        <SelectGameRole v-model="state.role" :server="state.server" />
      </UFormGroup>

      <UFormGroup :label="t('award')">
        <div class="bg-card-box rounded-2xl p-4">
          <DataItemList :items="eventData.jar.reward" class="justify-center"/>
        </div>
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
const configStore = useConfigStore()
const eventData = computed(() => configStore.eventLimited.halloween.data)
const emits = defineEmits(['done', 'close'])

const loading = ref(false)

const state = ref({
  server: null,
  role: null
})

const isActive = computed(() => {
  if(!state.value.server) return false
  if(!state.value.role) return false
  return true
})

const submit = async () => {
  try {
    loading.value = true
    await useAPI('limited/halloween/public/jar/receive', state.value)

    loading.value = false
    emits('done')
  }
  catch (e) {
    loading.value = false
  }
}
</script>