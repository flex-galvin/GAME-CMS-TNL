<template>
  <UiContent :title="t('limitedChristmasBoxOpen')" :sub="t('limitedChristmasBoxOpenSub')" class="Christmas rounded-2xl p-4">
    <UiIcon name="i-bx-x" size="8" class="christmas-text absolute top-2 right-2 cursor-pointer z-1" @click="emits('close')" />

    <UForm :state="state" @submit="submit" >
      <UFormGroup :label="t('has')" v-if="!!user">
        <UInput :model-value="`${user.star} ${t('limitedChristmasBoxTimes')}`" readonly />
      </UFormGroup>

      <UFormGroup :label="t('open')">
        <USelectMenu v-model="state.times" :options="[1,5,10]" size="lg">
          <template #label>{{ state.times }} {{ t('times') }}</template>
        </USelectMenu>
      </UFormGroup>

      <UFormGroup :label="t('server')">
        <SelectGameServer v-model="state.server" />
      </UFormGroup>

      <UFormGroup :label="t('role')" v-if="state.server" >
        <SelectGameRole v-model="state.role" :server="state.server" />
      </UFormGroup>

      <UiFlex justify="end" class="gap-1">
        <UButton class="christmas-btn-2" @click="submit" :loading="loading" v-if="!!isActive">{{ t('confirm') }}</UButton>
        <UButton color="gray" :disabled="loading" @click="emits('close')">{{ t('close') }}</UButton>
      </UiFlex>
    </UForm>

    <UModal v-model="modal" prevent-close>
      <UiContent :title="t('limitedChristmasBoxOpenGifts')" :sub="t('limitedChristmasBoxOpenGiftsSub')" class="Christmas p-4 rounded-2xl">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="close"></UButton>
        </template>

        <div class="lunar-box rounded-2xl p-4">
          <DataItemList :items="gifts" justify="center" />
        </div>
      </UiContent>
    </UModal>
  </UiContent>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps(['user'])
const emits = defineEmits(['close'])

const configStore = useConfigStore()
const eventData = computed(() => configStore.eventLimited.christmas.data)

const modal = ref(false)
const gifts = ref([])
const loading = ref(false)
const state = ref({
  times: 10,
  server: null,
  role: null
})

const isActive = computed(() => {
  if(!state.value.server) return false
  if(!state.value.role) return false
  if(!state.value.times) return false
  return true
})

const close = () => {
  modal.value = false
  emits('done')
}

const submit = async () => {
  try {
    loading.value = true

    // Reset
    gifts.value = []

    // Send
    const data = await useAPI('limited/christmas/public/box/play', state.value)
    loading.value = false

    // Apply
    gifts.value = data
    modal.value = true
  }
  catch (e) {
    gifts.value = []
    loading.value = false
  }
}
</script>