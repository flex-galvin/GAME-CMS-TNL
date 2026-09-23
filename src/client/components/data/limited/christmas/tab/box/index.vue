<template>
  <UiFlex type="col" justify="center" v-if="!!eventData">
    <UiFlex class="gap-1 absolute top-4 left-4 cursor-pointer christmas-text" @click="emits('back')">
      <UiIcon name="i-lets-icons-back" size="6"></UiIcon>
      <UiText size="sm" >{{ t('back') }}</UiText>
    </UiFlex>

    <div class="w-full cursor-pointer" @click="play">
      <DotLottieVue autoplay loop src="/animation/christmas/santa-gift-2.lottie" class="h-[200px] sm:h-[300px] w-auto" />  
    </div>

    <UiText class="text-[0.65rem] sm:text-xs md:text-sm mb-3 christmas-text -mt-4" v-if="!!userEvent && !eventData.rewardTime">
      {{ t('has') }} <span class="MRC-1">{{ userEvent.star }}</span> {{ t('limitedChristmasBoxTimes') }}
    </UiText>

    <UiFlex class="gap-1 mb-6">
      <button class="christmas-btn px-2 sm:px-4 py-1 rounded-2xl text-[0.65rem] sm:text-sm font-bold text-black" v-if="!!userEvent" @click="modal.history = true">{{ t('limitedChristmasBoxHistoryBtn') }}</button>
      <button class="christmas-btn-3 px-2 sm:px-4 py-1 rounded-2xl text-[0.65rem] sm:text-sm font-bold text-black" @click="modal.step = true">{{ t('limitedChristmasBoxStep') }}</button>
    </UiFlex>

    <DataLimitedChristmasTabBoxHelp v-if="!eventData.rewardTime" />

    <UModal v-model="modal.history" prevent-close :ui="{width: 'sm:max-w-[800px]'}">
      <UiContent :title="t('limitedChristmasBoxHistoryBtn')" :sub="t('limitedChristmasBoxHistorySub')" class="Christmas rounded-2xl p-4">
        <UiIcon name="i-bx-x" size="8" class="christmas-text absolute top-2 right-2 cursor-pointer z-1" @click="modal.history = false" />

        <DataLimitedChristmasTabBoxHistory />
      </UiContent>
    </UModal>

    <UModal v-model="modal.step" prevent-close>
      <DataLimitedChristmasTabBoxStep :user="userEvent" @close="modal.step = false" />
    </UModal>

    <UModal v-model="modal.receive" preventClose>
      <DataLimitedChristmasTabBoxReceive :user="userEvent" @close="modal.receive = false" @done="donePlay"  />
    </UModal>
  </UiFlex>
</template>

<script setup>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
const { t } = useI18n()

const emits = defineEmits(['back'])

const authStore = useAuthStore()
const configStore = useConfigStore()
const eventData = computed(() => configStore.eventLimited.christmas.data)
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
    const data = await useAPI('limited/christmas/public/user')

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