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
    
    <!-- <UiIcon name="i-bx-x" class="absolute top-2 right-2 cursor-pointer" size="10" square @click="toggleMenu" v-if="!!open"></UiIcon> -->
    
    <LayoutPlayMenu class="mt-12 sm:mt-0" :admin="admin" v-if="!!open"/>
    <LayoutPublicMenuMini v-if="!!open" />
  </UiFlex>

  <LayoutPlayOrientation />
  
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

const { $socket } = useNuxtApp()
const route = useRoute()
const configStore = useConfigStore()
const urlPlay = ref(null)

// Menu
const open = ref(false)
const toggleMenu = () => {
  open.value = !open.value
}

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
  
  if(detail.type == 'OPEN-MENU') return toggleMenu()
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