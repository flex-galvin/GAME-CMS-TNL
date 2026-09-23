import { defineStore } from 'pinia'
import type { IDBUserStore } from '~~/types'

export const useAuthStore = defineStore('auth', () => {
  const modal = ref(false)
  const tab = ref(0)
  const isLogin = ref(false)
  const isAdmin = ref(false)
  const isSMod = ref(false)
  const isDev = ref(false)
  const profile : Ref<IDBUserStore | undefined> = ref(undefined)

  const setModal = (data : boolean, tabOpen? : number) => {
    modal.value = data
    tab.value = tabOpen || 0
  }

  const resetValue = () => {
    isLogin.value = false
    isAdmin.value = false
    isSMod.value = false
    isDev.value = false
    profile.value = undefined
  }

  const setAuth = async () => {
    try {
      const auth = await useAPI('auth/public/get', undefined, {
        key: `auth/public/get-${Date.now()}`,
      })
      isAdmin.value = auth.type == 3
      isDev.value = auth.type == 2
      isSMod.value = auth.type == 1
      isLogin.value = true
      profile.value = auth
    }
    catch(err){
      resetValue()
    }
  }

  const removeAuth = async (noAPI : boolean = false) => {
    try { !noAPI && await useAPI('auth/public/sign/out') } catch(_){}
    resetValue()
  }

  return { 
    modal, tab,
    isLogin, 
    profile, 
    isAdmin, 
    isSMod,
    isDev,
    setModal, 
    setAuth, 
    removeAuth 
  }
})