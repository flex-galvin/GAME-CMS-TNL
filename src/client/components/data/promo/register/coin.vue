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
    @click="action"
  >
    <div class="grow z-[2] pr-[130px] sm:pr-[140px]">
      <UiFlex type="col" class="mb-2" items="start">
        <UiText color="yellow" class="text-sm sm:text-base md:text-lg line-clamp-1" weight="bold">
          {{ t('promoRegister') }}
        </UiText>
        <UiText class="text-[0.65rem] sm:text-xs md:text-sm line-clamp-2">
          {{ t('promoRegisterInfo') }}
        </UiText>
      </UiFlex>

      <UiFlex justify="center">
        <UiText weight="bold" class="OPS bounce-anim uppercase text-lg sm:text-xl md:text-2xl" color="yellow">
          <UiNumber :num="data">
            <template #default="{ display }">
              {{ useMoney().miniMoney(display) }}
            </template>
          </UiNumber>
        </UiText>
      </UiFlex>
    </div>

    <img src="/images/promo/register-coin.png" class="
      absolute 
      right-[-5px] 
      bottom-[0] 
      h-[120px] sm:h-[150px] 
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

const action = () => {
  if(!!authStore.isLogin) return useNotify().error('Bạn đã đăng nhập tài khoản')
  authStore.setModal(true)
}
</script>