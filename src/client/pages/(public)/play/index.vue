<template>
  <iframe v-if="!!urlPlay" title="Playing Game" :src="urlPlay" width="100%" height="100%" class="Iframe"></iframe>

  <UiFlex 
    justify="center"
    class="fixed w-full h-full top-0 left-0 !items-start sm:!items-center" 
    :class="{
      'bg-black/50 backdrop-blur-xl': !!open
    }"
    v-if="!!open"
  >
    <div class="absolute w-full h-full top-0 left-0 cursor-pointer" @click="toggleMenu" v-if="!!open"></div>

    <UiFlex class="absolute top-2 right-2 gap-1" v-if="!!open">
      <UButton color="gray" icon="i-bx-x" square  @click="toggleMenu" size="lg"></UButton>
    </UiFlex>

    <LayoutPlayMenu class="mt-12 sm:mt-0" :admin="admin" v-if="!!open"/>
    <LayoutPublicMenuMini v-if="!!open" />
  </UiFlex>

  <LayoutPlayOrientation />

  <UModal v-model="modal.payment" preventClose :ui="{ width: 'sm:max-w-[700px]' }">
    <PlayModal :title="t('menuPayment')" :sub="t('menuPaymentInfo')" @close="modal.payment = false">
      <MainActionPayment />
    </PlayModal>
  </UModal>

  <UModal v-model="modal.giftcode" preventClose :ui="{ width: 'sm:max-w-[700px]' }">
    <PlayModal :title="t('menuGiftcode')" :sub="t('menuGiftcodeInfo')" @close="modal.giftcode = false">
      <MainActionGiftcode />
    </PlayModal>
  </UModal>

  <UModal v-model="modal.shop" preventClose :ui="{ width: 'sm:max-w-[700px]' }">
    <PlayModal :title="t('menuShop')" :sub="t('menuShopInfo')"  @close="modal.shop = false">
      <MainShop />
    </PlayModal>
  </UModal>

  <UModal v-model="modal.event" preventClose :ui="{ width: 'sm:max-w-[700px]' }">
    <PlayModal :title="t('menuEvent')" :sub="t('menuEventInfo')" @close="modal.event = false">
      <MainEvent />
    </PlayModal>
  </UModal>

  <UModal v-model="modal.minigame" preventClose :ui="{ width: 'sm:max-w-[700px]' }">
    <PlayModal :title="t('menuMinigame')" :sub="t('menuMinigameInfo')" @close="modal.minigame = false">
      <MainMinigame />
    </PlayModal>
  </UModal>

  <UModal v-model="modal.rank" preventClose :ui="{ width: 'sm:max-w-[700px]' }">
    <PlayModal :title="t('menuRank')" :sub="t('menuRankInfo')" @close="modal.rank = false">
      <MainRank />
    </PlayModal>
  </UModal>
  
  <UModal v-model="fastRecharge.modal" prevent-close>
    <DataShopItemBuy :item="fastRecharge.item" :server="fastRecharge.server" @close="fastRecharge.modal = false" @done="onDoneRecharge" class="p-4" />
  </UModal>

  <UModal v-model="fastGiftcode.modal" prevent-close>
    <DataGiftcodeReceive :giftcode="fastGiftcode.giftcode" :server="fastGiftcode.server" @close="fastGiftcode.modal = false" @done="onDoneGiftcode" class="p-4" />
  </UModal>
</template>

<script setup>
definePageMeta({
  layout: 'play-guest',
  middleware: 'play-guest'
})

const { t } = useI18n()
const { $socket } = useNuxtApp()
const route = useRoute()
const configStore = useConfigStore()
const urlPlay = ref(null)

// Menu
const open = ref(false)
const toggleMenu = () => {
  open.value = !open.value
}

// Modal Menu
const modal = ref({
  payment: false,
  giftcode: false,
  shop: false,
  event: false,
  minigame: false,
  rank: false
})

// Recharge Game
const fastRecharge = ref({
  modal: false,
  item: null,
  server: null
})

// On Fast Recharge
const onFastRecharge = async (detail) => {
  try {
    const data = await useAPI('shop/item/public/recharge/fast', detail)
    fastRecharge.value.item = data.item
    fastRecharge.value.server = data.server
    fastRecharge.value.modal = true
  }
  catch (e) {
    return
  }
}
// On Done Recharge
const onDoneRecharge = async (data) => {
  fastRecharge.value = {
    modal: false,
    item: null,
    server: null
  }
}

// Giftcode Game
const fastGiftcode = ref({
  modal: false,
  giftcode: null,
  server: null
})

// On Fast Giftcode
const onFastGiftcode = async (detail) => {
  try {
    const data = await useAPI('giftcode/public/fast', detail)
    fastGiftcode.value.giftcode = data.giftcode
    fastGiftcode.value.server = data.server
    fastGiftcode.value.modal = true
  }
  catch (e) {
    return
  }
}

// On Done Giftcode
const onDoneGiftcode = async () => {
  fastGiftcode.value = {
    modal: false,
    giftcode: null,
    server: null
  }
}

// Check Token
const checkToken = async () => {
  try {
    const data = await useAPI('game/token', { token: route.query.token })
    urlPlay.value = data
  }
  catch(e){
    useTo().navigateToSSL('/')
  }
}

// On SDK
const onSDK = (e) => {
  const detail = e.data
  if(!detail) return
  
  if(detail.type == 'OPEN-MENU'){
    if(!detail.target) return toggleMenu()
    if(detail.target == 'MINIGAME') return modal.value.minigame = true
    if(detail.target == 'PAYMENT') return modal.value.payment = true
    if(detail.target == 'SHOP') return modal.value.shop = true
    if(detail.target == 'EVENT') return modal.value.event = true
    if(detail.target == 'RANK') return modal.value.rank = true
    if(detail.target == 'GIFTCODE') return modal.value.giftcode = true
  }

  if(detail.code || detail.type == 'code') return onFastGiftcode(detail)
  if((detail.item_id && detail.item_name && detail.price) || detail.type == 'recharge') return onFastRecharge(detail)
}

onMounted(() => {
  $socket.on('disconnect', () => !configStore.config.game.hangup && useTo().navigateToSSL('/'))
  window.addEventListener('message', onSDK, false)
})
onBeforeRouteLeave(() => window.removeEventListener('message', onSDK, false))
checkToken()
</script>