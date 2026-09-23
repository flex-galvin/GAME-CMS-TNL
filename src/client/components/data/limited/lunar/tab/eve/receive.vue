<template>
  <UiContent :title="t('limitedLunarEveReceive')" :sub="t('limitedLunarEveReceiveSub')" class="Lunar rounded-2xl p-4">
    <UiIcon name="i-bx-x" size="8" class="lunar-text absolute top-2 right-2 cursor-pointer z-1" @click="emits('close')" />

    <UForm :state="state" @submit="submit" >
      <UFormGroup :label="t('server')">
        <SelectGameServer class="lunar-box rounded-2xl" v-model="state.server" />
      </UFormGroup>

      <UFormGroup :label="t('role')" v-if="!!state.server" >
        <SelectGameRole class="lunar-box rounded-2xl" v-model="state.role" :server="state.server" />
      </UFormGroup>

      <UFormGroup :label="t('award')">
        <div class="lunar-box rounded-2xl p-4">
          <DataItemList :items="eventData.eve.gift" class="justify-center"/>
        </div>
      </UFormGroup>

      <UiFlex justify="end" class="gap-1">
        <UButton class="lunar-btn" @click="submit" :loading="loading" v-if="!!isActiveBtn">{{ t('receive') }}</UButton>
        <UButton class="lunar-box" :disabled="loading" @click="emits('close')">{{ t('close') }}</UButton>
      </UiFlex>
    </UForm>
  </UiContent>
</template>

<script setup>
const { t } = useI18n()

const props = defineProps(['reward'])
const emits = defineEmits(['close'])

const authStore = useAuthStore()
const configStore = useConfigStore()
const eventData = computed(() => configStore.eventLimited.lunar.data)

const loading = ref(false)

const state = ref({
  server: null,
  role: null
})

const isActiveBtn = computed(() => {
  if(!state.value.server) return false
  if(!state.value.role) return false
  return true
})

const submit = async () => {
  try {
    loading.value = true
    await useAPI('limited/lunar/public/eve/receive', state.value)

    loading.value = false
    emits('close')
  }
  catch (e) {
    loading.value = false
  }
}
</script>