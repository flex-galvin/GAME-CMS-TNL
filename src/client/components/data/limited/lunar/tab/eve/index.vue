<template>
  <UiFlex class="w-full" type="col" v-if="eventData.eve && eventData.eve.gift && eventData.eve.gift.length > 0">
    <UiFlex justify="center" type="col" class="mb-4" v-if="!!eventData.eve.time">
      <UiText align="center" class="text-[0.6rem] sm:text-xs md:text-sm">{{ t('limitedLunarEveTime') }}</UiText>
      <UiText class="FTV lunar-text text-lg sm:text-xl md:text-2xl" align="center">
        <UiCountdown :time="eventData.eve.time" />
      </UiText>
    </UiFlex>

    <DataItemList :items="eventData.eve.gift" justify="center" class="sm:max-w-[300px]" />

    <button class="lunar-btn mt-4 px-2 sm:px-4 py-1 rounded-2xl text-[0.65rem] sm:text-sm font-bold text-black" @click="modal = true" v-if="!!btnActive">
      {{ t('receiveReward') }}
    </button>

    <UModal v-model="modal" prevent-close>
      <DataLimitedLunarTabEveReceive @close="modal = false"/>
    </UModal>
  </UiFlex>
</template>

<script setup>
const { t } = useI18n()
const { dayjs } = useDayJs()

const emits = defineEmits(['back'])
const authStore = useAuthStore()
const configStore = useConfigStore()
const eventData = computed(() => configStore.eventLimited.lunar.data)

const btnActive = computed(() => {
  if(!authStore.isLogin) return false
  if(!eventData.value) return false
  if(!eventData.value.eve) return false
  if(!eventData.value.eve.time) return false
  if(!eventData.value.eve.gift) return false
  if(!eventData.value.eve.gift.length) return false

  const nowTime = dayjs(Date.now()).unix()
  const startTime = dayjs(eventData.value.eve.time).unix()
  return nowTime >= startTime 
})

const modal = ref(false)
</script>