<template>
  <div class="Lunar p-4 rounded-2xl relative overflow-hidden" v-if="!!eventData">
    <UiIcon name="i-bx-x" size="8" class="lunar-text absolute top-2 right-2 cursor-pointer z-1" @click="onBackOrClose" />

    <DotLottieVue autoplay loop src="/animation/lunar/peach.lottie" class="absolute top-[50px] right-[-95px] w-[350px] sm:right-[-190px] sm:w-[700px] select-none pointer-events-none" /> 

    <UiFlex type="col" items="start" class="relative mb-2 pointer-events-none">   
      <UiText class="FTV lunar-text-title text-xl sm:text-2xl md:text-3xl lg:text-4xl">Năm Mới An Lành</UiText>
      <UiText class="FTV lunar-text-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl">2026</UiText>
    </UiFlex>

    <UiFlex justify="center" type="col" class="mb-4" v-if="!!eventData.rewardTime">
      <UiText align="center" class="text-[0.6rem] sm:text-xs md:text-sm">{{ t('limitedLunarTimeEndText') }}</UiText>
      <UiText class="FTV lunar-text text-lg sm:text-xl md:text-2xl" align="center">
        <UiCountdown :time="eventData.rewardTime" />
      </UiText>
    </UiFlex>

    <UiFlex justify="center" type="col" class="mb-4" v-else>
      <UiText align="center" class="text-[0.6rem] sm:text-xs md:text-sm">{{ t('limitedLunarTimeActiveText') }}</UiText>
      <UiText class="FTV lunar-text text-lg sm:text-xl md:text-2xl" align="center">
        <UiCountdown :time="eventData.time.end" />
      </UiText>
    </UiFlex>

    <div>
      <UiFlex type="col" v-if="!selectTab" class="gap-6 md:gap-10">
        <UiFlex justify="between" class="w-full">
          <UiFlex type="col" class="relative grow w-[50%] max-w-[50%] cursor-pointer" @click="selectTab = 'jar'">
            <DotLottieVue autoplay loop src="/animation/lunar/lion.lottie" class="w-full scale-[1.1] pointer-events-none select-none" />   
            <UiText class="FTV text-sm sm:text-lg md:text-xl lunar-text" mini >{{ t('limitedLunarJar') }}</UiText>
            <UiText class="text-[0.6rem] sm:text-xs">{{ t('clickToView') }}</UiText>
          </UiFlex>

          <UiFlex type="col" class="relative grow w-[50%] max-w-[50%] cursor-pointer" @click="selectTab = 'top'">
            <DotLottieVue autoplay loop src="/animation/lunar/rank.lottie" class="w-full scale-[1.2] pointer-events-none select-none"/>    
            <UiText class="FTV text-sm sm:text-lg md:text-xl lunar-text" mini>{{ t('limitedLunarTop') }}</UiText>
            <UiText class="text-[0.6rem] sm:text-xs">{{ t('clickToView') }}</UiText>
          </UiFlex>
        </UiFlex>

        <UiFlex justify="between" class="w-full">
          <UiFlex type="col" class="relative grow w-[50%] max-w-[50%] cursor-pointer" @click="selectTab = 'redbag'">
            <DotLottieVue autoplay loop src="/animation/lunar/redbag.lottie" class="w-full scale-[0.85] pointer-events-none select-none" />   
            <UiText class="FTV text-sm sm:text-lg md:text-xl lunar-text" mini>{{ t('limitedLunarRedbag') }}</UiText>
            <UiText class="text-[0.6rem] sm:text-xs">{{ t('clickToView') }}</UiText>
          </UiFlex>

          <UiFlex type="col" class="relative grow w-[50%] max-w-[50%] cursor-pointer" @click="selectTab = 'piece'">
            <DotLottieVue autoplay loop src="/animation/lunar/2026.lottie" class="w-full scale-[1] pointer-events-none select-none" />    
            <UiText class="FTV text-sm sm:text-lg md:text-xl lunar-text" mini>{{ t('limitedLunarPiece') }}</UiText>
            <UiText class="text-[0.6rem] sm:text-xs">{{ t('clickToView') }}</UiText>
          </UiFlex>
        </UiFlex>
      </UiFlex>

      <div v-else>
        <DataLimitedLunarTabJar v-if="selectTab === 'jar'" @back="selectTab = null" />
        <DataLimitedLunarTabTop v-else-if="selectTab === 'top'" @back="selectTab = null" />
        <DataLimitedLunarTabRedbag v-else-if="selectTab === 'redbag'" @back="selectTab = null" />
        <DataLimitedLunarTabPiece v-else-if="selectTab === 'piece'" @back="selectTab = null" />
      </div>
    </div>

    <DataLimitedLunarTabEve class="mt-10 sm:mt-12" v-if="selectTab == null" />
  </div>
</template>

<script setup>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
const { t } = useI18n()
const emits = defineEmits(['close'])
const configStore = useConfigStore()
const eventData = computed(() => configStore.eventLimited.lunar.data)
const selectTab = ref(null)

const onBackOrClose = () => {
  if(!!selectTab.value) return selectTab.value = null
  else emits('close')
}
</script>