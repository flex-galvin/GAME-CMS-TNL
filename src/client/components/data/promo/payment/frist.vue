<template>
  <UiFlex 
    class="
      bg-card-box w-full
      rounded-2xl 
      gap-4 
      pl-4 pt-2
      cursor-pointer 
      overflow-hidden
      h-[150px] min-h-[150px] max-h-[150px] 
      relative overflow-hidden
    " 
    @click="navigateTo('/payment')"
  >
    <div class="grow z-[2] pr-[140px]">
      <UiFlex type="col" class="mb-2" items="start">
        <UiText color="purple" class="text-lg line-clamp-1" weight="bold">
          {{ t('promoPayFrist') }}
        </UiText>
        <UiText class="text-sm line-clamp-2">
          {{ t('promoPayFristInfo') }}
        </UiText>
      </UiFlex>

      <UiFlex justify="center">
        <UiText size="2xl" weight="bold" class="OPS bounce-anim uppercase text-2xl" color="purple">
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