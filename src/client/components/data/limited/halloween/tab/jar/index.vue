<template>
  <div class="w-full">
    <UiFlex type="col" class="gap-2 mb-4" justify="center">
      <UiFlex class="relative w-[180px] h-[180px] sm:w-[250px] sm:h-[250px]" justify="center">
        <svg class="w-full h-full" :viewBox="`0 0 ${actualSize} ${actualSize}`">
          <circle
            :cx="center"
            :cy="center"
            :r="radius"
            fill="none"
            stroke="currentColor"
            :stroke-width="actualStrokeWidth"
            class="halloween-ring-bg"
          />
          <circle
            :cx="center"
            :cy="center"
            :r="radius"
            fill="none"
            stroke="currentColor"
            :stroke-width="actualStrokeWidth"
            class="halloween-ring-progress"
            stroke-linecap="round"
            :stroke-dasharray="dashOffset"
            transform="rotate(-90 25 25)"
          />
        </svg>

        <DotLottieVue 
          class="!absolute pointer-events-none w-[200px] sm:w-[300px]"  
          autoplay loop 
          src="/animation/halloween/PUMPKIN-JAR.lottie" 
        />
      </UiFlex>

      <button 
        class="halloween-btn-2 px-2 sm:px-4 py-1 rounded-2xl text-[0.65rem] sm:text-sm font-bold text-black mt-2" 
        v-if="percent >= 100" 
        @click="onReceive()"
      >
        {{ t('receiveReward') }}
      </button>
      <UiText class="halloween-text FTV text-base sm:text-lg md:text-xl lg:text-2xl" v-else>{{ t('limitedHalloweenJarNowProcess') }} {{ percent }}%</UiText>
    </UiFlex>

    <DataLimitedHalloweenTabJarHelp v-if="!eventData.rewardTime" />

    <UModal v-model="modal.receive" prevent-close>
      <DataLimitedHalloweenTabJarReceive @close="modal.receive = false" @done="modal.receive = false" />
    </UModal>
  </div>
</template>

<script setup>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
const { t } = useI18n()
const authStore = useAuthStore()
const configStore = useConfigStore()
const eventData = computed(() => configStore.eventLimited.halloween.data)

const modal = ref({
  receive: false,
  history: false
})

const percent = computed(() => {
  const value = Math.floor((eventData.value.jar.now / eventData.value.jar.target) * 100)
  return value >= 100 ? 100 : value
})

const onReceive = () => {
  if(!authStore.isLogin) return useNotify().error(t('errorAuthEmpty'))
  modal.value.receive = true
}

const actualSize = 50
const actualStrokeWidth = 3
const radius = actualSize / 2 - actualStrokeWidth
const circumference = 2 * Math.PI * radius
const center = actualSize / 2
const dashOffset = computed(() => `${(percent.value / 100) * circumference} ${circumference}`)
</script>

<style scoped>
.halloween-ring-bg {
  fill: none;
  stroke: rgba(255, 140, 0, 0.2);
}

.halloween-ring-progress {
  fill: none;
  stroke: #ffb24d;
  filter: drop-shadow(0 0 1px #ffb24d);
}
</style>
