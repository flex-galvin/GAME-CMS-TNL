<template>
  <UiFlex type="col" justify="center" class="Halloween px-4 pt-10 pb-4 rounded-2xl relative" v-if="!!eventData">
    <UiIcon name="i-bx-x" size="8" class="halloween-text absolute top-2 right-2 cursor-pointer z-1" @click="emits('close')" v-if="!!showClose" />

    <UiFlex type="col" justify="center" class="mb-2">
      <UiText weight="bold" class="HLW-2 halloween-text-title text-4xl sm:text-5xl md:text-6xl" align="center">HALLOWEEN</UiText>
      <UiText class="HLW-2 halloween-text-title text-2xl sm:text-3xl md:text-4xl p-2" align="center" mini>{{ t('limitedHalloweenSub') }}</UiText>
    </UiFlex>

    <UiFlex justify="center" type="col" class="mb-4" v-if="!!eventData.rewardTime">
      <UiText align="center" class="halloween-text text-[0.6rem] sm:text-xs md:text-sm">{{ t('limitedHalloweenTimeEndText') }}</UiText>
      <UiText class="HLW-1 halloween-text text-xl sm:text-2xl md:text-3xl" align="center">
        <UiCountdown :time="eventData.rewardTime" />
      </UiText>
    </UiFlex>

    <UiFlex justify="center" type="col" class="mb-4" v-else>
      <UiText align="center" class="halloween-text text-[0.6rem] sm:text-xs md:text-sm">{{ t('limitedHalloweenTimeActiveText') }}</UiText>
      <UiText class="HLW-1 halloween-text text-xl sm:text-2xl md:text-3xl" align="center">
        <UiCountdown :time="eventData.time.end" />
      </UiText>
    </UiFlex>
    
    <UiFlex wrap justify="center" class="mb-4 gap-0.5">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="selectTab = tab.key"
        class="HLW-1 halloween-btn px-2 sm:px-4 pt-1.5 pb-0.5 rounded-2xl text-[0.65rem] sm:text-base"
        :class="{ 
          'halloween-btn--active': selectTab === tab.key 
        }"
      >
        {{ tab.label }}
      </button>
    </UiFlex>

    <Transition name="page" mode="out-in">
      <DataLimitedHalloweenTabJar v-if="selectTab == 'jar'"/>
      <DataLimitedHalloweenTabTop v-else-if="selectTab == 'top'"/>
      <DataLimitedHalloweenTabPumpkin v-else-if="selectTab == 'pumpkin'"/>
    </Transition>
  </UiFlex>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps(['showClose'])
const emits = defineEmits(['close'])

const configStore = useConfigStore()
const eventData = computed(() => configStore.eventLimited.halloween.data)

const tabs = [
  { key: 'jar', label: t('limitedHalloweenJar') },
  { key: 'top', label: t('limitedHalloweenTop') },
  { key: 'pumpkin', label: t('limitedHalloweenPumpkin') },
]
const selectTab = ref('jar')
</script>