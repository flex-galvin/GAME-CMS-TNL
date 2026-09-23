<template>
  <UiContent :title="t('limitedMonsterBloodAward')" :sub="t('limitedMonsterBloodAwardSub')" class="Monster rounded-2xl p-4">
    <UiIcon name="i-bx-x" size="8" class="monster-text-2 absolute top-2 right-2 cursor-pointer z-1" @click="emits('close')" />

    <div class="bg-card-box rounded-2xl">
      <UTable :columns="columns" :rows="list">
        <template #step-data="{ row }">
          <UiText class="monster-text" weight="bold">{{ row.step }}%</UiText>
        </template>

        <template #gift-data="{ row }">
          <DataItemListMini :items="row.gift" :max="2" />
        </template>

        <template #active-data="{ row }">
          <UiFlex justify="end">
            <button 
              class="monster-btn-2 px-2 sm:px-4 py-1 rounded-2xl text-[0.65rem] sm:text-sm font-bold text-black" 
              @click="select(row)"
              v-if="row.step >= process"
            >
              {{ t('receive') }}
            </button>
            <span class="text-[0.65rem] sm:text-sm" v-else>{{ t('notYetNeed') }}</span>
          </UiFlex>
        </template>
      </UTable>
    </div>

    <UModal v-model="modal" prevent-close>
      <UiContent :title="t('limitedMonsterBloodReceive')" :sub="t('limitedMonsterBloodReceiveSub')" class="Monster rounded-2xl p-4">
        <UiIcon name="i-bx-x" size="8" class="monster-text-2 absolute top-2 right-2 cursor-pointer z-1" @click="modal = false" />

        <UForm :state="state" @submit="submit" >
          <UFormGroup :label="t('need')" v-if="!!reward">
            <UInput :model-value="`${reward.step}%`" readonly />
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
            <UButton class="monster-btn-2" @click="submit" :loading="loading" v-if="!!isActive">{{ t('confirm') }}</UButton>
            <UButton color="gray" :disabled="loading" @click="modal = false">{{ t('close') }}</UButton>
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
const eventData = computed(() => configStore.eventLimited.monster.data)

const list = computed(() => eventData.value.blood.reward.sort((a, b) => b.step - a.step))
const reward = ref(null)

const modal = ref(false)
const loading = ref(false)

const columns = [
  { key: 'step', label: t('blood') },
  { key: 'gift', label: t('award') },
  { key: 'active', label: '' },
]

const state = ref({
  step: null,
  server: null,
  role: null
})

const process = computed(() => {
  if(!eventData.value) return 0
  if(!eventData.value.blood) return 0

  const blood = eventData.value.blood
  let per = Math.round((blood.now / blood.target) * 100)
  per = per > 100 ? 100 : per
  return 100 - per
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
    await useAPI('limited/monster/public/blood/receive', state.value)

    loading.value = false
    modal.value = false
  }
  catch (e) {
    loading.value = false
  }
}
</script>