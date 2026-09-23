<template>
  <div>
    <UAccordion 
      :items="navItems" 
      :ui="{
        'item': { padding: 'pt-0 pb-2 pl-8' },
      }"
      multiple
    >
      <template #default="{ item, open }">
        <UButton size="lg" block class="justify-start mb-2 bg-card-box" :icon="item.icon" :class="{
          '!text-white': !!open,
          '!text-gray-400': !open,
        }">
          <UiText class="mr-auto">{{ item.label }}</UiText>
          <UiIcon
            name="i-bx-chevron-right"
            size="5"
            color="gray"
            class="ms-auto transform transition-transform duration-200"
            :class="[open && 'rotate-90']"
          />
        </UButton>
      </template>

      <template #tab-0><UVerticalNavigation :links="navItems[0].children" @click="emits('to')"/></template>
      <template #tab-1><UVerticalNavigation :links="navItems[1].children" @click="emits('to')"/></template>
      <template #tab-2><UVerticalNavigation :links="navItems[2].children" @click="emits('to')"/></template>
      <template #tab-3><UVerticalNavigation :links="navItems[3].children" @click="emits('to')"/></template>
      <template #tab-4><UVerticalNavigation :links="navItems[4].children" @click="emits('to')"/></template>
      <template #tab-5><UVerticalNavigation :links="navItems[5].children" @click="emits('to')"/></template>
      <template #tab-6><UVerticalNavigation :links="navItems[6].children" @click="emits('to')"/></template>
      <template #tab-7><UVerticalNavigation :links="navItems[7].children" @click="emits('to')"/></template>
      <template #tab-8><UVerticalNavigation :links="navItems[8].children" @click="emits('to')"/></template>
      <template #tab-9><UVerticalNavigation :links="navItems[9].children" @click="emits('to')"/></template>
      <template #tab-10><UVerticalNavigation :links="navItems[10].children" @click="emits('to')"/></template>
      <template #tab-11><UVerticalNavigation :links="navItems[11].children" @click="emits('to')"/></template>
      <template #tab-12><UVerticalNavigation :links="navItems[12].children" @click="emits('to')"/></template>
      <template #tab-13><UVerticalNavigation :links="navItems[13].children" @click="emits('to')"/></template>
      <!-- <template #tab-14><UVerticalNavigation :links="navItems[14].children" @click="emits('to')"/></template> -->
    </UAccordion>
  </div>
</template>

<script setup>
const { t } = useI18n()
const emits = defineEmits(['to'])
const navItems = computed(() => [
  {
    label: t('menuManageMain'),
    icon: 'i-bxs-grid-alt',
    defaultOpen: false,
    slot: 'tab-0',
    children: [
      { label: t('menuManageStatistical'), to: '/manage/statistic' },
      { label: t('menuManageSpend'), to: '/manage/spend' },
      { label: t('menuManageIPWhiteList'), to: '/manage/ip/whitelist' },
      { label: t('menuManageIPUser'), to: '/manage/ip/user' },
    ]
  },
  {
    label: t('menuManageConfig'),
    icon: 'i-bxs-cog',
    defaultOpen: false,
    slot: 'tab-1',
    children: [
      { label: t('menuManageConfigEnable'), to: '/manage/config/enable' },
      { label: t('menuManageConfigPage'), to: '/manage/config/page' },
      { label: t('menuManageConfigMenu'), to: '/manage/config/menu' },
      { label: t('menuManageConfigPromo'), to: '/manage/config/promo' },
      { label: t('menuManageConfigVip'), to: '/manage/config/vip' },
      { label: t('menuManageConfigGame'), to: '/manage/config/game' },
      { label: t('menuManageConfigAPISocial'), to: '/manage/config/apisocial' },
      { label: t('menuManageConfigPermission'), to: '/manage/config/permission' },
      { label: t('menuManageConfigSocket'), to: '/manage/config/socket' },
      { label: t('menuManageConfigAction'), to: '/manage/config/action' },
    ]
  },
  {
    label: t('menuManageAds'),
    icon: 'i-bx-spreadsheet',
    defaultOpen: false,
    slot: 'tab-2',
    children: [
      { label: t('menuManageAdsLanding'), to: '/manage/ads/landing' },
      { label: t('menuManageAdsFrom'), to: '/manage/ads/from' }
    ]
  },
  {
    label: t('menuManageNews'),
    icon: 'i-bx-news',
    defaultOpen: false,
    slot: 'tab-3',
    children: [
    { label: t('menuManageNewsCategory'), to: '/manage/news/category' }, 
    { label: t('menuManageNewsIndex'), to: '/manage/news' }, 
    ]
  },
  {
    label: t('menuManageUser'),
    icon: 'i-bx-user',
    defaultOpen: false,
    slot: 'tab-4',
    children: [
      { label: t('menuManageUserIndex'), to: '/manage/user' }, 
      { label: t('menuManageUserLevel'), to: '/manage/user/level' },
    ]
  },
  {
    label: t('menuManagePayment'),
    icon: 'i-bx-credit-card',
    defaultOpen: false,
    slot: 'tab-5',
    children: [
      { label: t('menuManageGate'), to: '/manage/payment/gate' }, 
      { label: t('menuManagePaymentIndex'), to: '/manage/payment' }, 
    ]
  },
  {
    label: t('menuManageGame'),
    icon: 'i-bx-cube-alt',
    defaultOpen: false,
    slot: 'tab-6',
    children: [
      { label: t('menuManageGameSendItem'), to: '/manage/game/send' },
      { label: t('menuManageItem'), to: '/manage/game/item' },
      { label: t('menuManageItemBox'), to: '/manage/game/itembox' }, 
      { label: t('menuManageGameServers'), to: '/manage/game/server' },
      { label: t('menuManageGameRoles'), to: '/manage/game/roles' }
    ]
  },
  {
    label: t('menuManageGiftcode'),
    icon: 'i-bx-barcode-reader',
    defaultOpen: false,
    slot: 'tab-7',
    children: [
      { label: t('menuManageGiftcodeIndex'), to: '/manage/giftcode' }, 
      { label: t('menuManageGiftcodeHistory'), to: '/manage/giftcode/history' }, 
    ]
  },
  {
    label: t('menuManageShop'),
    icon: 'i-bx-shopping-bag',
    defaultOpen: false,
    slot: 'tab-8',
    children: [
      { label: t('menuManageShopCategory'), to: '/manage/shop/category' },
      { label: t('menuManageShopItem'), to: '/manage/shop/item' },
      { label: t('menuManageShopPack'), to: '/manage/shop/pack' },
      { label: t('menuManageShopHistory'), to: '/manage/shop/history' }, 
    ]
  },
  {
    label: t('menuManageEvent'),
    icon: 'i-bx-calendar',
    defaultOpen: false,
    slot: 'tab-9',
    children: [
      { label: t('menuManageEventPower'), to: '/manage/event/power' },
      { label: t('menuManageEventReferral'), to: '/manage/event/referral' },
      { label: t('menuManageEventLogin'), to: '/manage/event/login' }, 
      { label: t('menuManageEventPay'), to: '/manage/event/pay' }, 
      { label: t('menuManageEventSpend'), to: '/manage/event/spend' },
      { label: t('menuManageEventPaymusty'), to: '/manage/event/paymusty' }, 
      { label: t('menuManageEventPaydays'), to: '/manage/event/paydays' }, 
      { label: t('menuManageEventHistory'), to: '/manage/event/history' },
    ]
  },
  {
    label: t('menuManageLimited'),
    icon: 'i-bx-time',
    defaultOpen: false,
    slot: 'tab-10',
    children: [
      { label: t('menuManageLimitedShop'), to: '/manage/limited/shop' }, 
      { label: t('menuManageLimitedPay'), to: '/manage/limited/pay' },
      { label: t('menuManageLimitedHalloween'), to: '/manage/limited/halloween' },
      { label: t('menuManageLimitedChristmas'), to: '/manage/limited/christmas' },
      { label: t('menuManageLimitedMonster'), to: '/manage/limited/monster' },
      { label: t('menuManageLimitedLootchest'), to: '/manage/limited/lootchest' },
      { label: t('menuManageLimitedLunar'), to: '/manage/limited/lunar' }
    ]
  },
  {
    label: t('menuManageMinigame'),
    icon: 'i-bx-game',
    defaultOpen: false,
    slot: 'tab-11',
    children: [
      { label: t('menuManageMinigameWheel'), to: '/manage/minigame/wheel' }, 
      { label: t('menuManageMinigameEgg'), to: '/manage/minigame/egg' },
      { label: t('menuManageMinigameHistory'), to: '/manage/minigame/history' },
    ]
  },
  {
    label: t('menuManageRank'),
    icon: 'i-bx-bar-chart-alt-2',
    defaultOpen: false,
    slot: 'tab-12',
    children: [
      { label: t('menuManageRankLevel'), to: '/manage/rank/level' },
      { label: t('menuManageRankPower'), to: '/manage/rank/power' }, 
      { label: t('menuManageRankPayment'), to: '/manage/rank/payment' }, 
      { label: t('menuManageRankSpend'), to: '/manage/rank/spend' },
    ]
  },
  {
    label: t('menuManageLog'),
    icon: 'i-bx-book',
    defaultOpen: false,
    slot: 'tab-13',
    children: [
      { label: t('menuManageLogAdmin'), to: '/manage/log/admin' }, 
      { label: t('menuManageLogSendItem'), to: '/manage/log/send' },
    ]
  }
])
</script>