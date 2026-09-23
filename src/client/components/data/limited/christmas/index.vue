<template>
  <div class="Christmas px-4 pt-8 pb-4 rounded-2xl relative overflow-hidden" v-if="!!eventData">
    <UiIcon name="i-bx-x" size="8" class="christmas-text absolute top-2 right-2 cursor-pointer z-1" @click="emits('close')" />

    <UiFlex type="col" justify="center" class="relative mb-2 pointer-events-none">   
      <DotLottieVue autoplay loop src="/animation/christmas/santa-fly.lottie" class="absolute w-[400px] sm:w-[600px]" /> 
      <UiText class="MRC-1 christmas-text-banner text-3xl sm:text-4xl md:text-5xl">Merry</UiText>
      <UiText class="MRC-1 christmas-text-banner text-4xl sm:text-5xl md:text-6xl">Christmas</UiText>
    </UiFlex>

    <UiFlex justify="center" type="col" class="mb-4" v-if="!!eventData.rewardTime">
      <UiText align="center" class="christmas-text text-[0.6rem] sm:text-xs md:text-sm">{{ t('limitedChristmasTimeEndText') }}</UiText>
      <UiText class="MRC-3 christmas-text text-xl sm:text-2xl md:text-3xl" align="center">
        <UiCountdown :time="eventData.rewardTime" />
      </UiText>
    </UiFlex>

    <UiFlex justify="center" type="col" class="mb-4" v-else>
      <UiText align="center" class="christmas-text text-[0.6rem] sm:text-xs md:text-sm">{{ t('limitedChristmasTimeActiveText') }}</UiText>
      <UiText class="MRC-3 christmas-text text-xl sm:text-2xl md:text-3xl" align="center">
        <UiCountdown :time="eventData.time.end" />
      </UiText>
    </UiFlex>

    <Transition name="page" mode="out-in">
      <div v-if="!selectTab">
        <UiFlex justify="between" class="mb-6 md:mb-10 mt-4 md:mt-6">
          <UiFlex type="col" class="relative grow max-w-[50%]">
            <DotLottieVue autoplay loop src="/animation/christmas/tree.lottie" class="w-full scale-[1.2] cursor-pointer" @click="selectTab = 'jar'" />   
            <UiText class="MRC-2 text-lg sm:text-2xl md:text-3xl christmas-text cursor-pointer" mini @click="selectTab = 'jar'">{{ t('limitedChristmasJar') }}</UiText>
            <UiText class="text-[0.6rem] sm:text-xs">{{ t('clickToView') }}</UiText>
          </UiFlex>

          <UiFlex type="col" class="relative grow max-w-[50%]">
            <DotLottieVue autoplay loop src="/animation/christmas/santa-gift.lottie" class="w-full cursor-pointer" @click="selectTab = 'box'" />    
            <UiText class="MRC-2 text-lg sm:text-2xl md:text-3xl christmas-text cursor-pointer" mini @click="selectTab = 'box'">{{ t('limitedChristmasBox') }}</UiText>
            <UiText class="text-[0.6rem] sm:text-xs">{{ t('clickToView') }}</UiText>
          </UiFlex>
        </UiFlex>

        <UiFlex type="col" justify="center">
          <div class="christmas-ribbon MRC-1 text-sm sm:text-base md:text-xl z-[1]">{{ t('limitedChristmasTopLeaderboard') }}</div>
          <DataLimitedChristmasTabTop class="mt-[-10px]" />
        </UiFlex>
      </div>

      <div v-else>
        <DataLimitedChristmasTabJar v-if="selectTab === 'jar'" @back="selectTab = null" />
        <DataLimitedChristmasTabBox v-else-if="selectTab === 'box'" @back="selectTab = null" />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
const { t } = useI18n()
const emits = defineEmits(['close'])
const configStore = useConfigStore()
const eventData = computed(() => configStore.eventLimited.christmas.data)
const selectTab = ref(null)

const process = computed(() => {
  if(!eventData.value) return 0
  if(!eventData.value.jar) return 0

  const jar = eventData.value.jar
  const per = Math.round((jar.now / jar.target) * 100)
  return per > 100 ? 100 : per
})
</script>