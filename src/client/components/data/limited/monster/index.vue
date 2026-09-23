<template>
  <div class="Monster px-4 pt-8 pb-4 rounded-2xl relative overflow-hidden" v-if="!!eventData">
    <UiIcon name="i-bx-x" size="8" class="monster-text-2 absolute top-2 right-2 cursor-pointer z-1" @click="emits('close')" />

    <UiFlex justify="center" class="relative mb-2 pointer-events-none">   
      <UiText class="MST-1 monster-text-title text-3xl sm:text-4xl md:text-5xl" align="center">{{ t('menuLimitedMonster') }}</UiText>
    </UiFlex>

    <UiFlex justify="center" type="col" v-if="!!eventData.rewardTime">
      <UiText align="center" class="monster-text text-[0.6rem] sm:text-xs md:text-sm">{{ t('limitedMonsterTimeEndText') }}</UiText>
      <UiText class="FTV monster-text sm:text-lg md:text-xl" align="center">
        <UiCountdown :time="eventData.rewardTime" />
      </UiText>
    </UiFlex>

    <UiFlex justify="center" type="col" v-else>
      <UiText align="center" class="monster-text text-[0.6rem] sm:text-xs md:text-sm">{{ t('limitedMonsterTimeActiveText') }}</UiText>
      <UiText class="FTV monster-text sm:text-lg md:text-xl" align="center">
        <UiCountdown :time="eventData.time.end" />
      </UiText>
    </UiFlex>

    <div class="w-full">
      <DotLottieVue autoplay loop src="/animation/monster/monster-2.lottie" class="h-[200px] sm:h-[250px] w-auto" />  
    </div>

    <UiFlex justify="center" class="mb-2" v-if="!!authStore.isLogin && !!authStore.profile && !!eventData.lasthit && !!eventData.lasthit.user && (eventData.lasthit.user._id == authStore.profile._id)">
      <button class="monster-btn-2 px-2 sm:px-4 py-1 rounded-2xl text-[0.65rem] sm:text-sm font-bold" @click="modal.lasthit = true">
        {{ t('limitedMonsterLasthitBtn') }}
      </button>
    </UiFlex>

    <div class="monster-box rounded-2xl p-4 pb-3 mb-2">
      <UiFlex justify="between" class="mb-2">
        <UiText class="monster-text text-xs md:text-sm lg:text-base" weight="bold">{{ t('limitedMonsterBloodHP') }}</UiText>
        <UiText class="monster-text text-xs md:text-sm lg:text-base" weight="bold">
          {{ useMoney().miniMoney((eventData.blood.target - eventData.blood.now) < 0 ? 0 : (eventData.blood.target - eventData.blood.now)) }} 
          / 
          {{ useMoney().miniMoney(eventData.blood.target) }}
        </UiText>
      </UiFlex>

      <UiFlex class="relative monster-bar rounded-2xl w-full h-3 md:h-4">
        <UiFlex justify="center" class="monster-process" :style="{
          width: `${process}%`
        }"></UiFlex>
      </UiFlex>

      <UiFlex justify="between" class="mt-2 gap-2">
        <UiFlex type="col" items="start" class="gap-0.5 sm:gap-1">
          <UiText class="text-[0.65rem] md:text-xs lg:text-sm text-[#95a3b0]">
            {{ t('limitedMonsterBloodProcess') }}
            <strong class="monster-text">{{ process }}%</strong>
          </UiText>
          <UiText class="text-[0.65rem] md:text-xs lg:text-sm text-[#95a3b0]">
            {{ t('limitedMonsterBloodTotal') }}
            <strong class="monster-text">{{ useMoney().miniMoney(eventData.blood.now) }}</strong>
          </UiText>
          <UiText class="text-[0.65rem] md:text-xs lg:text-sm text-[#95a3b0]">
            {{ t('limitedMonsterBloodLasthit') }}
            <strong class="monster-text capitalize">{{ eventData.lasthit.user ? eventData.lasthit.user.username : t('no') }}</strong>
          </UiText>
        </UiFlex>

        <button class="monster-btn px-2 sm:px-4 py-1 rounded-2xl text-[0.65rem] sm:text-sm font-bold ml-auto" @click="modal.blood = true">
          {{ t('award') }}
        </button>
      </UiFlex>
    </div>

    <div v-if="!eventData.rewardTime">
      <UiFlex justify="center" wrap class="mb-2 gap-0.5">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="selectTab = tab.key"
          class="monster-btn px-2 sm:px-4 py-1 font-semibold rounded-2xl text-[0.65rem] sm:text-base"
          :class="{ 
            'monster-btn--active': selectTab === tab.key 
          }"
        >
          {{ tab.label }}
        </button>
      </UiFlex>

      <Transition name="page" mode="out-in">
        <DataLimitedMonsterTabBloodHelp v-if="selectTab == 'help'"/>
        <DataLimitedMonsterTabTop v-else-if="selectTab == 'top'"/>
      </Transition>
    </div>
    <DataLimitedMonsterTabTop v-else />

    <UModal v-model="modal.blood" preventClose>
      <DataLimitedMonsterTabBloodReward @close="modal.blood = false" />
    </UModal>

    <UModal v-model="modal.lasthit" preventClose>
      <DataLimitedMonsterTabLasthitReceive @close="modal.lasthit = false" @done="modal.lasthit = false" />
    </UModal>
  </div>
</template>

<script setup>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
const { t } = useI18n()
const emits = defineEmits(['close'])
const authStore = useAuthStore()
const configStore = useConfigStore()
const eventData = computed(() => configStore.eventLimited.monster.data)

const tabs = [
  { key: 'help', label: t('help') },
  { key: 'top', label: t('rank') },
]
const selectTab = ref('help')

const modal = ref({
  blood: false,
  lasthit: false
})

const process = computed(() => {
  if(!eventData.value) return 0
  if(!eventData.value.blood) return 0

  const blood = eventData.value.blood
  let per = Math.round((blood.now / blood.target) * 100)
  per = per > 100 ? 100 : per
  return 100 - per
})
</script>