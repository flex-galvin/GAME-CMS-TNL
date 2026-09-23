<template>
  <UiFlex type="col" justify="center" v-if="!!eventData">
    <UiFlex class="gap-1 absolute top-4 left-4 cursor-pointer christmas-text" @click="emits('back')">
      <UiIcon name="i-lets-icons-back" size="6"></UiIcon>
      <UiText size="sm" >{{ t('back') }}</UiText>
    </UiFlex>

    <div class="w-full">
      <DotLottieVue autoplay loop src="/animation/christmas/tree-3.lottie" class="h-[300px] sm:h-[400px] w-auto" />  
    </div>

    <UiFlex type="col" justify="center" class="w-[90%] sm:w-[70%] -mt-3" :class="{
      'mb-[5.5rem] sm:mb-[6.5rem]': eventData.jar?.reward?.length > 0,
      'mb-8': eventData.jar?.reward?.length == 0,
    }">
      <UiText class="text-[0.65rem] sm:text-xs md:text-sm mb-3 christmas-text">{{ t('limitedChristmasJarNowProcess') }} {{ process }}%</UiText>

      <UiFlex class="relative christmas-bar rounded-2xl w-full h-3 md:h-4">
        <UiFlex justify="center" class="christmas-process" :style="{
          width: `${process}%`
        }"></UiFlex>

        <UiFlex 
          v-for="(item, index) in eventData.jar?.reward" :key="index"
          class="
            inline-flex absolute 
            top-5 
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
          <DotLottieVue autoplay loop src="/animation/christmas/giftbox.lottie" class="h-[50px] md:h-[60px]" />
          <UiText align="center" class="text-[0.65rem] sm:text-xs md:text-sm christmas-text absolute -bottom-4" weight="bold" v-if="process >= item.step">{{ t('receive') }}</UiText>
          <UiText align="center" color="gray" class="text-[0.65rem] sm:text-xs md:text-sm absolute -bottom-4 MRC-1" v-else>{{ item.step }}%</UiText>
        </UiFlex>
      </UiFlex>
    </UiFlex>

    <DataLimitedChristmasTabJarHelp v-if="!eventData.rewardTime" />

    <UModal v-model="modal.receive" prevent-close>
      <DataLimitedChristmasTabJarReceive :reward="select" @close="modal.receive = false" @done="modal.receive = false" />
    </UModal>
  </UiFlex>
  
</template>

<script setup>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
const { t } = useI18n()

const emits = defineEmits(['back'])
const authStore = useAuthStore()
const configStore = useConfigStore()
const eventData = computed(() => configStore.eventLimited.christmas.data)

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
