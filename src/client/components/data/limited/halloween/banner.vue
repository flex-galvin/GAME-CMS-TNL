<template>
  <UiFlex 
    v-if="eventData"
    class="
      color-halloween-light bg-box-light bg-box-light--active-before 
      rounded-2xl 
      gap-4 
      pr-1
      overflow-hidden
      h-[150px] max:h-[150px]
      cursor-pointer
    "
    @click="configStore.setEventLimitedModal('halloween', true)"
  >
    <img :src="`/images/limited/halloween/pumpkin.png`" class="absolute left-[-40px] bottom-[-35px] h-[150px] w-auto z-[1] beat-2-anim" />
    
    <div class="grow z-[2] pl-[100px]">
      <UiFlex type="col" class="gap-1" items="center">
        <UiText class="halloween-text-title HLW-2 text-2xl">{{ t('menuLimitedHalloween') }}</UiText>

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
const { t } = useI18n()
const configStore = useConfigStore()
const eventData = computed(() => configStore.eventLimited.halloween.data)
</script>