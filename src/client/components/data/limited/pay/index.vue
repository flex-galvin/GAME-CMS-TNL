<template>
  <div class="LimitedPay px-4 pt-8 pb-4 rounded-2xl relative overflow-hidden" v-if="!!eventData">
    <UiIcon name="i-bx-x" size="8" class="limited-pay-text-2 absolute top-2 right-2 cursor-pointer z-1" @click="emits('close')" />

    <UiFlex justify="center" class="relative my-2 pointer-events-none">   
      <UiText class="FTV limited-pay-text-title text-3xl sm:text-4xl md:text-5xl" align="center">{{ t('menuLimitedPay') }}</UiText>
    </UiFlex>

    <UiFlex justify="center" type="col" class="mb-4">
      <UiText align="center" class="limited-pay-text text-[0.6rem] sm:text-xs md:text-sm">{{ t('limitedPayTimeActiveText') }}</UiText>
      <UiText class="FTV limited-pay-text sm:text-lg md:text-xl" align="center">
        <UiCountdown :time="eventData.time.end" />
      </UiText>
    </UiFlex>

    <UiFlex justify="between" class="mb-2 gap-2" v-if="!!userData">
      <UiText class="text-xs md:text-sm text-white/90">{{ t('limitedPayMyMoney') }}</UiText>
      <UiText class="FTV limited-pay-text text-xs md:text-sm">{{ useMoney().toMoney(userData.money) }} VNĐ</UiText>
    </UiFlex>

    <DataEmpty text="Các mốc thưởng không khả dụng" v-if="!reward" class="bg-card-box rounded-2xl"></DataEmpty>

    <div class="grid grid-cols-12 gap-3" v-if="!!reward">
      <div 
        v-for="item in reward" :key="item._id"
        class="col-span-6 bg-black/20 rounded-2xl px-4 pt-11 pb-8 sm:pt-12 w-full relative"
        :class="{
          'hover:scale-95 ease-in duration-200 cursor-pointer': !!item.receive && !item.receive.active
        }"
        @click="selectAward(item)"
      >
        <div 
          class="limited-pay-ribbon rounded-tl-xl pl-3 pr-2 FTV text-sm sm:text-base"
          :class="{
            'limited-pay-ribbon--disabled': !!item.receive && !item.receive.active
          }"
        >{{ useMoney().toMoney(item.step) }}</div>

        <DataItemListMini justify="center" :items="item.gift" size="lg" :max="3" class="max-sm:hidden pointer-events-none"/>
        <DataItemListMini justify="center" :items="item.gift" size="md" :max="2" class="sm:hidden pointer-events-none" />

        <UiText v-if="!!item.receive" class="absolute bottom-2 left-3 text-[0.65rem] sm:text-xs" :color="item.receive.color" weight="semibold">
          {{ item.receive.text }}
        </UiText>
      </div>
    </div>

    <UModal v-model="modal.receive" preventClose>
      <DataLimitedPayReceive :award="award" @done=" getUser" @close="modal.receive = false" />
    </UModal>
  </div>
</template>

<script setup>
const { t } = useI18n()
const emits = defineEmits(['close'])
const configStore = useConfigStore()

const eventData = computed(() => configStore.eventLimited.pay.data)
const userData = ref({ money: 0, receive: [] })
const award = ref()

const modal = ref({
  receive: false
})

const reward = computed(() => {
  if(!eventData.value) return null
  if(!userData.value) return null
  if(!userData.value.receive) return null
  const reward = eventData.value.reward

  reward.forEach(item => {
    if(!!userData.value.receive.includes(item.step)) item.receive = { active: true, text: 'Đã Nhận', color: 'green' }
    else {
      if(userData.value.money < item.step) item.receive = { active: false, text: 'Chưa Đạt', color: 'gray' }
      else item.receive = { active: false, text: 'Chưa Nhận', color: 'gray' }
    }
  })

  return reward
})

const selectAward = (item) => {
  if(!!item.receive.active) return false
  award.value = item
  modal.value.receive = true
}

const getUser = async () => {
  try {
    const data = await useAPI('limited/pay/public/user')
    userData.value = data
    modal.value.receive = false
  }
  catch(e){
    userData.value = { money: 0, receive: []}
    modal.value.receive = false
  }
}

onMounted(() => getUser())
</script>