<template>
  <UiFlex type="col" justify="center" v-if="!!eventData">
    <div class="w-full -mt-14">
      <DotLottieVue autoplay loop src="/animation/lunar/lion.lottie" class="h-[300px] w-auto pointer-events-none select-none" />  
    </div>

    <UiFlex type="col" justify="center" class="w-[90%] sm:w-[80%] -mt-14" :class="{
      'mb-[5.5rem]': eventData.jar?.reward?.length > 0,
      'mb-9': eventData.jar?.reward?.length == 0,
    }">
      <UiFlex justify="between" class="w-full mb-2">
        <UiText class="text-xs md:text-sm lunar-text">{{ t('limitedLunarJarNowProcess') }} {{ process }}%</UiText>
        <UiText class="text-xs md:text-sm lunar-text">{{ useMoney().toMoney(eventData.jar?.now) }} / {{ useMoney().toMoney(eventData.jar?.target) }}</UiText>
      </UiFlex>

      <UiFlex class="relative lunar-bar rounded-2xl w-full h-3 md:h-4">
        <UiFlex justify="center" class="lunar-process" :style="{
          width: `${process}%`
        }"></UiFlex>

        <UiFlex 
          v-for="(item, index) in eventData.jar?.reward" :key="index"
          class="
            inline-flex absolute 
            top-6 
            w-[50px] h-[50px] max-w-[50px] max-h-[50px] 
            sm:w-[60px] sm:h-[60px] sm:max-w-[60px] sm:max-h-[60px]
            translate-x-[-50%] 
            cursor-pointer
          " 
          :style="{
            left: `${item.step}%`
          }" 
          type="col" justify="center"
          @click="viewReward(item)"
        >
          <DotLottieVue autoplay loop src="/animation/lunar/giftbox.lottie" class="h-[50px] md:h-[60px]" />
          <UiText align="center" class="text-[0.65rem] sm:text-xs md:text-sm lunar-text absolute -bottom-4" weight="bold" v-if="process >= item.step">{{ t('receive') }}</UiText>
          <UiText align="center" class="text-[0.65rem] sm:text-xs md:text-sm absolute -bottom-4 FTV" v-else>{{ item.step }}%</UiText>
        </UiFlex>
      </UiFlex>
    </UiFlex>

    <DataLimitedLunarTabJarHelp v-if="!eventData.rewardTime" />

    <UModal v-model="modal.receive" prevent-close>
      <DataLimitedLunarTabJarReceive :reward="select" @close="modal.receive = false" @done="modal.receive = false" />
    </UModal>
  </UiFlex>
  
</template>

<script setup>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
const { t } = useI18n()

const emits = defineEmits(['back'])
const authStore = useAuthStore()
const configStore = useConfigStore()
const eventData = computed(() => configStore.eventLimited.lunar.data)

const modal = ref({
  receive: false
})

const select = ref(null)

const viewReward = (item) => {
  select.value = item
  modal.value.receive = true
}

const process = computed(() => {
  if(!eventData.value) return 0
  if(!eventData.value.jar) return 0

  const jar = eventData.value.jar
  const per = Math.round((jar.now / jar.target) * 100)
  return per > 100 ? 100 : per
})
</script>
