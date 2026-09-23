<template>
  <Transition name="notify-running">
    <UiFlex
      class="
        NotifyRunning 
        max-w-[300px] md:max-w-[400px]
        top-[calc(var(--header-size)+var(--menu-top-size)+10px)] lg:top-[calc(var(--header-size)+10px)]
        px-4
      " 
      justify="center" 
      v-if="!!isRunning && !!showSetting"
    >
      <SocketNotifyRunningEffect :data="select" v-if="!!select" class="w-full">
        <SocketNotifyRunningText :message="select.content" class="grow" @end="end" :key="update" />
      </SocketNotifyRunningEffect>
    </UiFlex>
  </Transition>
</template>

<script setup>
const { t } = useI18n()
const route = useRoute()
const configStore = useConfigStore()
const socketStore = useSocketStore()

const list = ref([])
const length = computed(() => list.value.length)

const select = ref(null)

const update = ref(0)
const isRunning = ref(false)

const showSetting = computed(() => {
  if(socketStore.notifyRunningEnable == 'all') return true
  if(socketStore.notifyRunningEnable == 'only-home') return !route.name.includes('play')
  return true
})

const start = () => {
  if (list.value.length == 0) select.value = null
  else select.value = list.value[0]

  update.value = update.value + 1
  isRunning.value = true
} 

const end = () => {
  isRunning.value = false
  
  setTimeout(() => {
    list.value.shift()
    select.value = null
    start()
  }, 1000)
}

watch(() => length.value, () => !select.value && start())

watch(() => socketStore.notify.running.push.update, () => {
  const data = socketStore.notify.running.push.data
  list.value.push(data)
})

onMounted(() => {
  list.value.push({ user: null, content: configStore.config.notiruning.helloworld || t('helloworld') })
})
</script>

<style lang="sass">
.NotifyRunning
  position: fixed
  left: 50%
  z-index: 20
  transform: translateX(-50%)
  .UserName
    box-shadow: 0 2px 8px 1px #000000bf
.notify-running-enter-from
  opacity: 0
  transform: translateX(calc(-50% + 20px))
.notify-running-enter-to
  opacity: 1
  transform: translateX(-50%)
.notify-running-enter-active
  transition: all 0.3s ease
.notify-running-leave-from
  opacity: 1
  transform: translateX(-50%)
.notify-running-leave-to 
  opacity: 0
  transform: translateX(calc(-50% - 20px))
.notify-running-leave-active
  transition: all 0.3s ease
</style>