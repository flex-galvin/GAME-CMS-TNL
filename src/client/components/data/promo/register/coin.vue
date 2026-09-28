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
      relative
    " 
    @click="action"
  >
    <div class="grow z-[2] pr-[140px]">
      <UiFlex type="col" class="mb-2" items="start">
        <UiText color="yellow" class="text-lg line-clamp-1" weight="bold">
          {{ t('promoRegister') }}
        </UiText>
        <UiText class="text-sm line-clamp-2">
          {{ t('promoRegisterInfo') }}
        </UiText>
      </UiFlex>

      <UiFlex justify="center">
        <UiText weight="bold" class="OPS bounce-anim uppercase text-2xl" color="yellow">
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