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
    @click="navigateTo('/shop')"
  >
    <div class="grow z-[2] pr-[130px] sm:pr-[140px]">
      <UiFlex type="col" class="mb-2" items="start">
        <UiText color="pink" class="text-sm sm:text-base md:text-lg line-clamp-1" weight="bold">
          {{ t('promoShopDiscount') }}
        </UiText>
        <UiText class="text-[0.65rem] sm:text-xs md:text-sm line-clamp-2">
          {{ t('promoShopDiscountInfo') }}
        </UiText>
      </UiFlex>

      <UiFlex justify="center">
        <UiText size="2xl" weight="bold" class="FTV bounce-anim uppercase text-lg sm:text-xl md:text-2xl" color="pink">
          <UiNumber :num="data">
            <template #default="{ display }">
              {{ useMoney().miniMoney(display) }}%
            </template>
          </UiNumber>
        </UiText>
      </UiFlex>
    </div>

    <img src="/images/promo/shop-discount.png" class="
      absolute 
      right-[-5px] 
      bottom-[0] 
      h-[125px] sm:h-[155px] 
      w-auto 
      z-[1] 
      beat-2-anim
    " />
  </UiFlex>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps(['data'])
const authStore = useAuthStore()

</script>