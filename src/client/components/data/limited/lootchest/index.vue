<template>
  <div class="Lootchest px-4 pt-8 pb-4 rounded-2xl relative overflow-hidden" v-if="!!eventData">
    <UiIcon name="i-bx-x" size="8" class="lootchest-text-2 absolute top-2 right-2 cursor-pointer z-1" @click="emits('close')" />

    <UiFlex justify="center" class="relative my-2 pointer-events-none">   
      <UiText class="FTV lootchest-text-title text-3xl sm:text-4xl md:text-5xl" align="center">{{ t('menuLimitedLootchest') }}</UiText>
    </UiFlex>

    <UiFlex justify="center" type="col" v-if="!!eventData.rewardTime">
      <UiText align="center" class="lootchest-text text-[0.6rem] sm:text-xs md:text-sm">{{ t('limitedLootchesTimeEndText') }}</UiText>
      <UiText class="FTV lootchest-text sm:text-lg md:text-xl" align="center">
        <UiCountdown :time="eventData.rewardTime" />
      </UiText>
    </UiFlex>

    <UiFlex justify="center" type="col" v-else>
      <UiText align="center" class="lootchest-text text-[0.6rem] sm:text-xs md:text-sm">{{ t('limitedLootchesTimeActiveText') }}</UiText>
      <UiText class="FTV lootchest-text sm:text-lg md:text-xl" align="center">
        <UiCountdown :time="eventData.time.end" />
      </UiText>
    </UiFlex>

    <div class="w-full">
      <DotLottieVue autoplay loop mode="reverse-bounce" src="/animation/lootchest/chest.lottie" class="h-[180px] sm:h-[250px] w-auto" />  
    </div>

    <UiFlex justify="between" type="col" class="mb-2" v-if="!!eventData.owner">
      <UiText class="FTV lootchest-text md:text-lg lg:text-xl capitalize" weight="bold">{{ hideName(eventData.owner.username) }}</UiText>
      <UiText class="text-[0.65rem] sm:text-xs text-[#95a3b0]">{{ t('limitedLootchestOwnerInfo') }}</UiText>
    </UiFlex>

    <div class="bg-card-box rounded-2xl p-2">
      <DataItemList :items="eventData.reward" justify="center" :size="50"/>
    </div>

    <UButton block class="bg-animate !text-white mt-2" @click="modal.payment = true" v-if="!eventData.rewardTime">
      <UiFlex type="col">
        <UiText class="mt-1.5 mb-0.5 text-xs">
          {{ t('limitedLootchestMoneyNeed', { need: useMoney().toMoney(eventData.money.need) }) }}
        </UiText>
        <UiText size="2xl" weight="bold" class="OPS bounce-anim uppercase">{{ t('payNow') }}</UiText>
      </UiFlex>
    </UButton>

    <UButton 
      block class="bg-animate !text-white mt-2" 
      @click="modal.receive = true" 
      v-if="!!eventData.rewardTime && !!eventData.owner && !!eventData.owner._id && !!authStore.isLogin && !!authStore.profile && eventData.owner._id == authStore.profile._id
    ">
      <UiFlex type="col">
        <UiText class="mt-1.5 mb-0.5 text-xs">{{ t('limitedLootchestOwnerWin') }}</UiText>
        <UiText size="2xl" weight="bold" class="OPS bounce-anim uppercase" >{{ t('receiveReward') }}</UiText>
      </UiFlex>
    </UButton>

    <UModal v-model="modal.payment" preventClose :ui="{ width: 'sm:max-w-[700px]' }">
      <UiContent :title="t('menuPayment')" :sub="t('menuPaymentInfo')" class="bg-card p-4 rounded-2xl">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.payment = false"></UButton>
        </template>

        <MainActionPayment />
      </UiContent>
    </UModal>

    <UModal v-model="modal.receive" preventClose>
      <DataLimitedLootchestReceive @close="modal.receive = false" @done="doneReceive" />
    </UModal>
  </div>
</template>

<script setup>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
const { t } = useI18n()
const authStore = useAuthStore()
const configStore = useConfigStore()
const eventData = computed(() => configStore.eventLimited.lootchest.data)
const emits = defineEmits(['close'])

const modal = ref({
  payment: false,
  receive: false
})

const hideName = (str) => {
  if (str.length <= 3) return '*'.repeat(str.length);
  return str.slice(0, 3 * -1) + '***';
}

const doneReceive = () => {
  modal.value.receive = false
  emits('close')
}
</script>