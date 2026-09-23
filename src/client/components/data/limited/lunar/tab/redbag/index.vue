<template>
  <UiFlex type="col" justify="center" v-if="!!eventData">
    <div class="w-full cursor-pointer mb-4" @click="play">
      <DotLottieVue autoplay loop src="/animation/lunar/redbag.lottie" class="h-[200px] w-auto pointer-events-none select-none" />  
    </div>

    <UiText class="text-[0.65rem] sm:text-xs md:text-sm mb-3" v-if="!!userEvent && !eventData.rewardTime">
      {{ t('has') }} <span class="lunar-text font-bold">{{ userEvent.redbag ? userEvent.redbag.count : 0 }}</span> {{ t('limitedLunarRedbagCount') }}
    </UiText>

    <UiFlex class="gap-1">
      <button class="lunar-btn px-2 sm:px-4 py-1 rounded-2xl text-[0.65rem] sm:text-sm font-bold text-black" v-if="!!userEvent" @click="modal.history = true">{{ t('limitedLunarRedbagHistoryBtn') }}</button>
      <button class="lunar-btn px-2 sm:px-4 py-1 rounded-2xl text-[0.65rem] sm:text-sm font-bold text-black" @click="modal.step = true">{{ t('limitedLunarRedbagStep') }}</button>
    </UiFlex>

    <DataLimitedLunarTabRedbagHelp class="!mt-4" v-if="!eventData.rewardTime" />

    <UModal v-model="modal.history" prevent-close :ui="{width: 'sm:max-w-[800px]'}">
      <UiContent :title="t('limitedLunarRedbagHistoryBtn')" :sub="t('limitedLunarRedbagHistorySub')" class="Lunar rounded-2xl p-4">
        <UiIcon name="i-bx-x" size="8" class="lunar-text absolute top-2 right-2 cursor-pointer z-1" @click="modal.history = false" />

        <DataLimitedLunarTabRedbagHistory />
      </UiContent>
    </UModal>

    <UModal v-model="modal.step" prevent-close>
      <DataLimitedLunarTabRedbagStep :user="userEvent" @close="modal.step = false" />
    </UModal>

    <UModal v-model="modal.receive" preventClose>
      <DataLimitedLunarTabRedbagReceive :user="userEvent" @close="modal.receive = false" @done="donePlay"  />
    </UModal>
  </UiFlex>
</template>

<script setup>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
const { t } = useI18n()

const emits = defineEmits(['back'])

const authStore = useAuthStore()
const configStore = useConfigStore()
const eventData = computed(() => configStore.eventLimited.lunar.data)
const userEvent = ref(null)

const loading = ref(true)
const modal = ref({
  receive: false,
  step: false,
  history: false
})

const play = async () => {
  try {
    if(!authStore.isLogin) throw t('errorAuthEmpty')
    if(!eventData.value) throw t('errorEventEmptyData')
    if(!!eventData.value.rewardTime) throw t('errorEventEnd')
    if(!userEvent.value) throw t('errorEventNotJoin')

    modal.value.receive = true
  }
  catch(e){
    useNotify().error(e)
  }
}

const donePlay = () => {
  getUser()
  // modal.value.receive = false
}

const getUser = async () => {
  try {
    loading.value = true
    const data = await useAPI('limited/lunar/public/user')

    userEvent.value = data
    loading.value = false
  }
  catch(e){
    userEvent.value = null
    loading.value = false
  }
}

onMounted(() => setTimeout(getUser, 1))
</script>