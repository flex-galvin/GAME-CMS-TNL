<template>
  <div class="w-full" v-if="eventData">
    <div class="mb-4">
      <Transition name="page" mode="out-in">
        <UiFlex type="col" justify="center" v-if="!userEvent || (!!userEvent && !userEvent.pumpkin.play)">
          <DotLottieVue 
            @click="play" 
            autoplay loop 
            src="/animation/halloween/PUMPKIN-HIDDEN.lottie"  
            class="w-[200px] h-[200px] sm:w-[300px] sm:h-[300px] cursor-pointer" 
          />

          <UiText class="halloween-text FTV text-sm sm:text-base md:text-lg lg:text-xl mt-[-2rem]" align="center" v-if="!!userEvent && !eventData.rewardTime">{{ t('limitedHalloweenPumpkinTimes') }} {{ userEvent.candy }}</UiText>
          <UiText class="halloween-text FTV text-sm sm:text-base md:text-lg lg:text-xl mt-[-2rem]" align="center" v-if="!!eventData.rewardTime">{{ t('limitedHalloweenPumpkinEnd') }}</UiText>
          <button class="halloween-btn-2 px-2 sm:px-4 py-1 rounded-2xl text-[0.65rem] sm:text-sm font-bold text-black mt-3" v-if="!!userEvent" @click="modal.history = true">{{ t('limitedHalloweenPumpkinHistoryBtn') }}</button>
        </UiFlex>

        <div v-else>
          <UiFlex justify="center" class="gap-1 sm:gap-2 mb-4">
            <div 
              class="halloween-pumpkin p-2 pb-1 rounded-2xl" 
              v-for="gift in userEvent.pumpkin.reward" 
              :key="gift._id" 
              @click="select(gift.item)"
            >
              <DataItem :item="gift.item" :amount="gift.amount" size="80" class="pointer-events-none" />
            </div>
          </UiFlex>

          <UiText class="halloween-text text-sm sm:text-base" align="center">{{ t('limitedHalloweenPumpkinPlayText') }}</UiText>
        </div>
      </Transition>
    </div>

    <DataLimitedHalloweenTabPumpkinHelp v-if="!eventData.rewardTime" />

    <UModal v-model="modal.receive" prevent-close>
      <DataLimitedHalloweenTabPumpkinReceive :reward="rewardSelect" @close="modal.receive = false" @done="end" />
    </UModal>

    <UModal v-model="modal.history" prevent-close :ui="{width: 'sm:max-w-[800px]'}">
      <UiContent :title="t('limitedHalloweenPumpkinHistory')" :sub="t('limitedHalloweenPumpkinHistorySub')" class="Halloween rounded-2xl p-4">
        <UiIcon name="i-bx-x" size="8" class="halloween-text absolute top-2 right-2 cursor-pointer z-1" @click="modal.history = false" />

        <DataLimitedHalloweenTabPumpkinHistory />
      </UiContent>
    </UModal>
  </div>
</template>

<script setup>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
const { t } = useI18n()
const authStore = useAuthStore()
const configStore = useConfigStore()
const eventData = computed(() => configStore.eventLimited.halloween.data)
const userEvent = ref(null)

const loading = ref(true)
const playing = ref(false)
const modal = ref({
  receive: false,
  history: false
})

const rewardSelect = ref()
const select = (reward) => {
  rewardSelect.value = reward
  modal.value.receive = true
}

const end = async () => {
  modal.value.receive = false
  rewardSelect.value = null
  getUser()
}

const play = async () => {
  try {
    if(!authStore.isLogin) return useNotify().error(t('errorAuthEmpty'))
    if(!userEvent.value) return useNotify().error(t('errorEventNotJoin'))
    if(!!playing.value) return useNotify().error(t('pleaseWait'))
    playing.value = true

    await useAPI('limited/halloween/public/pumpkin/play')
    getUser()
    playing.value = false
  }
  catch(e){
    playing.value = false
  }
}

const getUser = async () => {
  try {
    loading.value = true
    const data = await useAPI('limited/halloween/public/user')

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
