<template>
  <UiContent :title="t('limitedLunarJarReceive')" :sub="t('limitedLunarJarReceiveSub')" class="Lunar rounded-2xl p-4">
    <UiIcon name="i-bx-x" size="8" class="lunar-text absolute top-2 right-2 cursor-pointer z-1" @click="emits('close')" />

    <UForm :state="state" @submit="submit" >
      <div v-if="!!isActiveReward">
        <UFormGroup :label="t('server')">
          <SelectGameServer class="lunar-box rounded-2xl" v-model="state.server" />
        </UFormGroup>

        <UFormGroup :label="t('role')" v-if="!!state.server" >
          <SelectGameRole class="lunar-box rounded-2xl" v-model="state.role" :server="state.server" />
        </UFormGroup>
      </div>

      <UFormGroup :label="t('award')">
        <div class="lunar-box rounded-2xl p-4">
          <DataItemList :items="reward.gift" class="justify-center"/>
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
const emits = defineEmits(['done', 'close'])

const authStore = useAuthStore()
const configStore = useConfigStore()
const eventData = computed(() => configStore.eventLimited.lunar.data)

const loading = ref(false)

const state = ref({
  step: null,
  server: null,
  role: null
})

const process = computed(() => {
  if(!eventData.value) return 0
  if(!eventData.value.jar) return 0
  const jar = eventData.value.jar
  const per = Math.round((jar.now / jar.target) * 100)
  return per > 100 ? 100 : per
})

const isActiveReward = computed(() => {
  if(!authStore.isLogin) return false
  if(!props.reward) return false
  if(!eventData.value) return false
  if(props.reward.step > process.value) return false
  return true
})

const isActiveBtn = computed(() => {
  if(!isActiveReward.value) return false
  if(!state.value.server) return false
  if(!state.value.role) return false
  return true
})

const submit = async () => {
  try {
    loading.value = true
    state.value.step = props.reward.step
    await useAPI('limited/lunar/public/jar/receive', state.value)

    loading.value = false
    emits('done')
  }
  catch (e) {
    loading.value = false
  }
}
</script>