<template>
  <UiFlex 
    class="
      bg-card-box
      rounded-2xl 
      gap-4 
      pl-4 pt-2
      cursor-pointer 
      hover:scale-95 ease-in duration-200
      overflow-hidden
      h-[120px] min-h-[120px] max-h-[120px] 
      sm:h-[150px] sm:min-h-[150px] sm:max-h-[150px]
    " 
    @click="navigateTo('/payment')"
  >
    <div class="grow z-[2] pr-[130px] sm:pr-[140px]">
      <UiFlex type="col" class="mb-2" items="start">
        <UiText color="purple" class="text-sm sm:text-base md:text-lg line-clamp-1" weight="bold">
          {{ t('promoPayFrist') }}
        </UiText>
        <UiText class="text-[0.65rem] sm:text-xs md:text-sm line-clamp-2">
          {{ t('promoPayFristInfo') }}
        </UiText>
      </UiFlex>

      <UiFlex justify="center">
        <UiText size="2xl" weight="bold" class="OPS bounce-anim uppercase text-lg sm:text-xl md:text-2xl" color="purple">
          <UiNumber :num="data">
            <template #default="{ display }">
              {{ useMoney().toMoney(display) }}%
            </template>
          </UiNumber>
        </UiText>
      </UiFlex>
    </div>

    <img :src="`/images/promo/pay-frist.png`" class="
      absolute 
      right-[5px] 
      bottom-[0] 
      h-[115px] sm:h-[145px] 
      w-auto 
      z-[1] 
      beat-2-anim
    " />
  </UiFlex>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps(['data'])
</script>