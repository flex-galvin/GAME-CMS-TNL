<template>
  <UiContent :title="t('limitedLunarRedbagOpen')" :sub="t('limitedLunarRedbagOpenSub')" class="Lunar rounded-2xl p-4">
    <UiIcon name="i-bx-x" size="8" class="lunar-text absolute top-2 right-2 cursor-pointer z-1" @click="emits('close')" />

    <UForm :state="state" @submit="submit" >
      <UFormGroup :label="t('has')" v-if="!!user">
        <UInput class="lunar-box rounded-2xl" :model-value="`${user?.redbag?.count || 0} ${t('limitedLunarRedbagCount')}`" readonly />
      </UFormGroup>

      <UFormGroup :label="t('open')">
        <USelectMenu class="lunar-box rounded-2xl" v-model="state.times" :options="[1,5,10]" size="lg">
          <template #label>{{ state.times }} {{ t('times') }}</template>
        </USelectMenu>
      </UFormGroup>

      <UFormGroup :label="t('server')">
        <SelectGameServer class="lunar-box rounded-2xl" v-model="state.server" />
      </UFormGroup>

      <UFormGroup :label="t('role')" v-if="state.server" >
        <SelectGameRole class="lunar-box rounded-2xl" v-model="state.role" :server="state.server" />
      </UFormGroup>

      <UiFlex justify="end" class="gap-1">
        <UButton class="lunar-btn" @click="submit" :loading="loading" v-if="!!isActive">{{ t('confirm') }}</UButton>
        <UButton class="lunar-box" :disabled="loading" @click="emits('close')">{{ t('close') }}</UButton>
      </UiFlex>
    </UForm>

    <UModal v-model="modal" prevent-close>
      <UiContent :title="t('limitedLunarRedbagOpenGifts')" :sub="t('limitedLunarRedbagOpenGiftsSub')" class="Lunar p-4 rounded-2xl">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="close"></UButton>
        </template>

        <div class="mb-2" v-if="Object.entries(pieces).length > 0">
          <UiText size="sm" class="mb-2">{{ t('piece') }}</UiText>
          <UiFlex justify="center" class="lunar-box rounded-2xl p-4 gap-2" wrap>
            <DataItem v-for="(amount, piece) in pieces" :key="key" :item="{
              item_name: `Mảnh ${piece}`,
              item_image: `/images/limited/lunar/piece/${piece}.png`,
              type: 'custom'
            }" :amount="amount"/>
          </UiFlex>
        </div>

        <div>
          <UiText size="sm" class="mb-2">{{ t('item') }}</UiText>
          <div class="lunar-box rounded-2xl p-4">
            <DataItemList :items="gifts" justify="center" />
          </div>
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
const eventData = computed(() => configStore.eventLimited.lunar.data)

const modal = ref(false)
const gifts = ref([])
const pieces = ref(undefined)
const loading = ref(false)
const state = ref({
  times: 10,
  server: null,
  role: null
})

const isActive = computed(() => {
  if(!props.user) return false
  if(!props.user.redbag) return false
  if(!state.value.server) return false
  if(!state.value.role) return false
  if(!state.value.times) return false
  if(props.user.redbag.count < state.value.times) return false
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
    pieces.value = undefined
    gifts.value = []

    // Send
    const data = await useAPI('limited/lunar/public/redbag/play', state.value)
    loading.value = false

    // Apply
    gifts.value = data.gifts
    pieces.value = data.pieces
    modal.value = true
  }
  catch (e) {
    pieces.value = undefined
    gifts.value = []
    loading.value = false
  }
}
</script>