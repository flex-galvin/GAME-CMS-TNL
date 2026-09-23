<template>
  <div class="max-w-[500px] mx-auto">
    <ManageGameOs class="md:max-w-xl max-w-full mx-auto my-8 px-8" />

    <UiFlex justify="center" class="gap-2 flex-wrap mt-12">
      <UButton 
        v-for="(item, index) in menus" :key="index"
        size="xl" 
        class="
          flex flex-col justify-center 
          h-36 w-36
        "
        :class="{
          'bg-card-box': !!item.color
        }"
        :ui="{
          icon: { base: 'mb-2', size: { xl: 'h-10 w-10' } },
          font: 'font-semibold'
        }"
        :icon="item.icon"
        :color="item.color"
        @click="useTo().navigateToSSL(item.to)"
      >
        {{ item.label }}
      </UButton>
    </UiFlex>
  </div>
</template>

<script setup>
const { t } = useI18n()
const menus = computed(() => [
  { label: t('menuManageStatistical'), icon: 'i-bxs-bar-chart-alt-2', color: 'gray', to: '/manage/statistic' },
  { label: t('menuManagePayment'), icon: 'i-bxs-credit-card', color: 'gray', to: '/manage/payment' },
  { label: t('menuManageUser'), icon: 'i-bxs-user', color: 'gray', to: '/manage/user' },
  { label: t('menuManageConfig'), icon: 'i-bxs-cog', color: 'gray', to: '/manage/config/page' },
  { label: t('menuManageGiftcode'), icon: 'i-bx-barcode-reader', color: 'gray', to: '/manage/giftcode' },
  { label: t('menuManageShop'), icon: 'i-bx-shopping-bag', color: 'gray', to: '/manage/shop/item' },
  { label: t('menuManageEvent'), icon: 'i-bx-calendar', color: 'gray', to: '/manage/event/login' },
  { label: t('menuManageMinigame'), icon: 'i-bx-game', color: 'gray', to: '/manage/minigame/wheel' },
  { label: t('menuManageLog'), icon: 'i-bx-book', color: 'gray', to: '/manage/log/admin' },
])
</script>