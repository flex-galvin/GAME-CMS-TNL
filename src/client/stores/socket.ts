import { defineStore } from 'pinia'

export const useSocketStore = defineStore('socket', () => {
  const runtimeConfig = useRuntimeConfig()
  const notifyRunningEnableCookie = useCookie('notify-running-enable', runtimeConfig.public.cookieConfig)

  const connected : Ref<boolean> = ref(false)

  const online : Ref<number> = ref(0)

  const slideModal = ref(false)

  const tab : Ref<string | null> = ref('chat-global')

  const chat : Ref<any> = ref({
    global: {
      new: 0,
      push: {
        update: 0,
        data: null
      },
      del: {
        update: 0,
        data: null
      }
    }
  })

  const notify : Ref<any> = ref({
    single: {
      new: 0,
      push: {
        update: 0,
        data: null
      }
    },
    running: {
      push: {
        update: 0,
        data: null
      }
    }
  })

  function setConnected (data : boolean) {
    connected.value = data
  }

  function setSlideModal (data : boolean) {
    slideModal.value = data
  }

  function changeTab (data: string) {
    tab.value = data
  }

  function changeChatData (key: string, data : any) {
    chat.value[key] = Object.assign(chat.value[key], data)
  }

  function changeNotifyData (key: string, data : any) {
    notify.value[key] = Object.assign(notify.value[key], data)
  }
  
  function updateOnline (data : number) {
    online.value = data
  }

  const notifyRunningEnable = computed(() => {
    if(!notifyRunningEnableCookie.value) return 'only-home'
    if(!['all','only-home'].includes(notifyRunningEnableCookie.value)) return 'only-home'

    return notifyRunningEnableCookie.value
  })

  function setNotifyRunningEnable (data : string) {
    notifyRunningEnableCookie.value = data
  }

  return { 
    connected, setConnected,
    slideModal, setSlideModal,
    online, updateOnline,
    tab, changeTab,
    chat, changeChatData,
    notify, changeNotifyData,
    notifyRunningEnable, setNotifyRunningEnable
  }
})