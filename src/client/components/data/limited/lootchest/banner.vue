<template>
  <UiFlex 
    v-if="!!eventData"
    class="
      color-lootchest-light bg-box-light bg-box-light--active-before 
      rounded-2xl 
      gap-4 
      pr-1
      overflow-hidden
      h-[150px] max:h-[150px]
      cursor-pointer
    "
    @click="configStore.setEventLimitedModal('lootchest', true)"
  >
    <div class="grow z-[2] pl-[110px]">
      <DotLottieVue autoplay loop mode="bounce" src="/animation/lootchest/chest.lottie" class="absolute h-[150px] left-[-60px] top-[0]" /> 

      <UiFlex type="col" class="gap-1" items="center">
        <UiText class="FTV lootchest-text text-xl" align="center">{{ t('menuLimitedLootchest') }}</UiText>

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
const eventData = computed(() => configStore.eventLimited.lootchest.data)
</script>