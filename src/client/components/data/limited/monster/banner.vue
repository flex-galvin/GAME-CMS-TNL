<template>
  <UiFlex 
    v-if="!!eventData"
    class="
      color-monster-light bg-box-light bg-box-light--active-before 
      rounded-2xl 
      gap-4 
      pr-1
      overflow-hidden
      h-[150px] max:h-[150px]
      cursor-pointer
    "
    @click="configStore.setEventLimitedModal('monster', true)"
  >
    <div class="grow z-[2] pl-[80px]">
      <DotLottieVue autoplay loop src="/animation/monster/monster-2.lottie" class="absolute h-[90px] left-[-38px] bottom-[5px]" /> 

      <UiFlex type="col" class="gap-1" items="center">
        <UiText class="MST-1 text-xl" align="center">{{ t('menuLimitedMonster') }}</UiText>

        <UiText class="FTV uppercase" align="center" size="xl" v-if="!eventData.rewardTime">
          <UiCountdown :time="eventData.time.end" />
        </UiText>
        <UiText class="FTV uppercase" align="center" size="sm" v-else>
          {{ t('receiveReward') }}
        </UiText>
      </UiFlex>
    </div>
  </UiFlex>
</template>

<script setup>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
const { t } = useI18n()
const configStore = useConfigStore()
const eventData = computed(() => configStore.eventLimited.monster.data)
</script>