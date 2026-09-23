<template>
  <iframe v-if="!!urlPlay" title="Playing Game" :src="urlPlay" width="100%" height="100%" class="Iframe"></iframe>

  <LayoutPlayDrag :admin="true" />

  <LayoutPlayOrientation />
</template>

<script setup>
definePageMeta({
  layout: 'play-manage',
  middleware: 'play-manage'
})

const route = useRoute()
const urlPlay = ref(null)
const userID = computed(() => route.query.user)

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
  if((detail.item_id && detail.item_name && detail.price) || detail.type == 'recharge') return useNotify().error('Chế độ quản trị viên, không thể mua hàng')
}

onMounted(() => window.addEventListener('message', onSDK, false))
onUnmounted(() => window.removeEventListener('message', onSDK, false))
onBeforeRouteLeave(() => window.removeEventListener('message', onSDK, false))
checkToken()
</script>