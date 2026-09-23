<template>
  <UiFlex 
    v-if="eventData"
    class="
      color-christmas-light bg-box-light bg-box-light--active-before 
      rounded-2xl 
      gap-4 
      pr-1
      overflow-hidden
      h-[120px] max:h-[120px]
      cursor-pointer
    "
    @click="configStore.setEventLimitedModal('christmas', true)"
  >
    <div class="flake" aria-hidden="true">❆</div>
    <div class="flake" aria-hidden="true">✻</div>
    <div class="flake" aria-hidden="true">❅</div>
    <div class="flake" aria-hidden="true">✧</div>
    <div class="flake" aria-hidden="true">❆</div>
    <div class="ornament" aria-hidden="true"></div>

    <div class="grow z-[2] pl-[50px]">
      <UiFlex type="col" class="gap-1" items="center">
        <UiText class="christmas-text-banner MRC-1 text-2xl">{{ t('menuLimitedChristmas') }}</UiText>

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
const eventData = computed(() => configStore.eventLimited.christmas.data)
</script>

<style scoped>
.flake{
  position:absolute;
  font-size:12px;
  color: rgba(255,255,255,0.9);
  opacity: 0.85;
  user-select:none;
  pointer-events:none;
  animation: floaty linear infinite;
  z-index:4;
}
.flake:nth-child(1){ left: 7%; top: 20px; animation-duration: 6s; animation-delay: 0s; transform: scale(0.9); }
.flake:nth-child(2){ left: 28%; top: 68px; animation-duration: 8s; animation-delay: -1s; transform: scale(0.7); }
.flake:nth-child(3){ left: 46%; top: 14px; animation-duration: 5.5s; animation-delay: -0.8s; transform: scale(0.6); }
.flake:nth-child(4){ left: 64%; top: 100px; animation-duration: 7s; animation-delay: -2s; transform: scale(0.8); }
.flake:nth-child(5){ left: 82%; top: 12px; animation-duration: 6.5s; animation-delay: -1.5s; transform: scale(0.65); }
@keyframes floaty {
  0%   { transform: translateY(0) scale(1); opacity: 0.9; }
  50%  { transform: translateY(-8px) scale(1.05); opacity: 0.7; }
  100% { transform: translateY(0) scale(1); opacity: 0.9; }
}

.ornament{
  position: absolute;
  left: 15px;
  top: 65px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #fff6, #fff2 6%, transparent 10%),
              linear-gradient(180deg,#ff5252,#b71c1c 60%);
  box-shadow: 0 6px 18px rgba(0,0,0,0.5), inset 0 6px 16px rgba(255,255,255,0.08);
  z-index:5;
  display:flex;
  align-items:center;
  justify-content:center;
  transform-origin: center;
  animation: bob 4s ease-in-out infinite;
}
.ornament::before{
  content: "";
  position: absolute;
  top: -8px;
  width: 12px;
  height: 8px;
  background: #3338;
  border-radius: 3px;
  box-shadow: 0 2px 2px rgba(0,0,0,0.4);
}
.ornament::after{
  content: "";
  position: absolute;
  top: 0;
  transform: translateY(-88px);
  width: 1px;
  height: 80px;
  background: #3338;
  box-shadow: 0 2px 2px rgba(0,0,0,0.4);
}
@keyframes bob{
  0% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
  100% { transform: translateY(0); }
}
</style>