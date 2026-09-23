<template>
  <UiContent :title="t('limitedLunarRedbagStep')" :sub="t('limitedLunarRedbagStepSub')" class="Lunar rounded-2xl p-4">
    <UiIcon name="i-bx-x" size="8" class="lunar-text absolute top-2 right-2 cursor-pointer z-1" @click="emits('close')" />

    <UiFlex justify="between" class="gap-1 lunar-box rounded-2xl px-4 py-2 mb-2" v-if="!!user">
      <UiText size="sm">{{ t('limitedLunarRedbagOpenTotal') }}</UiText>
      <UiText size="sm FTV text-gradient">{{ user.redbag ? user.redbag.use : 0 }}</UiText>
    </UiFlex>

    <div class="lunar-box rounded-2xl">
      <UTable :columns="columns" :rows="list">
        <template #step-data="{ row }">
          <UiText class="FTV lunar-text">{{ row.step }}</UiText>
        </template>

        <template #gift-data="{ row }">
          <DataItemListMini :items="row.gift" :max="2" />
        </template>

        <template #active-data="{ row }">
          <UiFlex justify="end">
            <span class="text-[0.65rem] sm:text-sm" v-if="!authStore.isLogin || !user">{{ t('notYetNeed') }}</span>
            <div v-else>
              <button 
                class="lunar-btn px-2 sm:px-4 py-1 rounded-2xl text-[0.65rem] sm:text-sm font-bold text-black" 
                @click="select(row)"
                v-if="(user.redbag ? user.redbag.use : 0) >= row.step"
              >
                {{ t('receive') }}
              </button>
              <span class="text-[0.65rem] sm:text-sm" v-else>{{ t('notYetNeed') }}</span>
            </div>
          </UiFlex>
        </template>
      </UTable>
    </div>

    <UModal v-model="modal" prevent-close>
      <UiContent :title="t('limitedLunarRedbagStepReceive')" :sub="t('limitedLunarRedbagStepReceiveSub')" class="Lunar rounded-2xl p-4">
        <UiIcon name="i-bx-x" size="8" class="lunar-text absolute top-2 right-2 cursor-pointer z-1" @click="modal = false" />

        <UForm :state="state" @submit="submit" >
          <UFormGroup :label="t('need')" v-if="!!reward">
            <UInput class="lunar-box rounded-2xl" :model-value="`${t('open')} ${reward.step} ${t('limitedLunarRedbagCount')}`" readonly />
          </UFormGroup>

          <UFormGroup :label="t('server')">
            <SelectGameServer class="lunar-box rounded-2xl" v-model="state.server" />
          </UFormGroup>

          <UFormGroup :label="t('role')" v-if="state.server" >
            <SelectGameRole class="lunar-box rounded-2xl" v-model="state.role" :server="state.server" />
          </UFormGroup>

          <UFormGroup :label="t('award')" v-if="!!reward">
            <div class="lunar-box rounded-2xl p-4">
              <DataItemList :items="reward.gift" class="justify-center"/>
            </div>
          </UFormGroup>

          <UiFlex justify="end" class="gap-1">
            <UButton class="lunar-btn" @click="submit" :loading="loading" v-if="!!isActive">{{ t('confirm') }}</UButton>
            <UButton class="lunar-box" :disabled="loading" @click="modal = false">{{ t('close') }}</UButton>
          </UiFlex>
        </UForm>
      </UiContent>
    </UModal>
  </UiContent>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps(['user'])
const emits = defineEmits(['close'])

const authStore = useAuthStore()
const configStore = useConfigStore()
const eventData = computed(() => configStore.eventLimited.lunar.data)

const list = computed(() => eventData.value.redbag.reward.sort((a, b) => a.step - b.step))
const reward = ref(null)

const modal = ref(false)
const loading = ref(false)

const columns = [
  { key: 'step', label: t('open') },
  { key: 'gift', label: t('award') },
  { key: 'active', label: '' },
]

const state = ref({
  step: null,
  server: null,
  role: null
})

const select = (item) => {
  if(!authStore.isLogin) return useNotify().error(t('errorAuthEmpty'))
  reward.value = item
  state.value.step = item.step
  modal.value = true
}

const isActive = computed(() => {
  if(!state.value.server) return false
  if(!state.value.role) return false
  if(!reward.value) return false
  return true
})

const submit = async () => {
  try {
    loading.value = true
    await useAPI('limited/lunar/public/redbag/step', state.value)

    loading.value = false
    modal.value = false
  }
  catch (e) {
    loading.value = false
  }
}
</script>