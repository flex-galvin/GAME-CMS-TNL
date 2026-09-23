<template>
  <div v-if="user && user.vip && user.vip.enable">
    <UiText class="FTV mb-2 text-gradient text-sm md:text-base">{{ user.vip.type == 'day' ? t('vipDefault') : t('vipForever') }}</UiText>

    <div class="bg-card-box p-4 rounded-2xl">
      <UiFlex justify="between" class="mb-3">
        <UiText color="gray" class="text-sm">{{ t('expired') }}</UiText>
        <UiText class="text-sm"  weight="semibold">
          {{ user.vip.type == 'day' ? useDayJs().displayFull(user.vip.end) : t('vipForeverInfo') }}
        </UiText>
      </UiFlex>

      <UiFlex justify="between">
        <UiText color="gray" class="text-sm">{{ t('vipGift') }}</UiText>
        <UBadge size="sm" class="cursor-pointer" :color="user.vip.gift ? 'green' : 'gray'" @click="open">
          {{ user.vip.gift ? t('received') : t('clickReceive') }}
        </UBadge>
      </UiFlex>
    </div>

    <UModal v-model="modal" prevent-close>
      <UiContent :title="t('vipGift')" :sub="t('vipGiftSub')" class="bg-card rounded-2xl p-4">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square :disabled="loading" @click="modal = false"></UButton>
        </template>

        <UForm :state="state" @submit="submit">
          <UFormGroup :label="t('server')">
            <SelectGameServer v-model="state.server" />
          </UFormGroup>

          <UFormGroup :label="t('role')" v-if="!!state.server" >
            <SelectGameRole v-model="state.role" :server="state.server" />
          </UFormGroup>

          <UFormGroup :label="t('award')" v-if="gift">
            <div class="bg-card-box rounded-2xl p-4">
              <DataItemList :items="gift" class="justify-center"/>
            </div>
          </UFormGroup>

          <UiFlex justify="end" class="gap-1">
            <UButton class="bg-btn" @click="submit" :loading="loading" v-if="isActiveBtn">{{ t('confirm') }}</UButton>
            <UButton color="gray" :disabled="loading" @click="modal = false">{{ t('close') }}</UButton>
          </UiFlex>
        </UForm>
      </UiContent>
    </UModal>
  </div>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps(['user'])
const emits = defineEmits(['gift'])

const authStore = useAuthStore()
const configStore = useConfigStore()

const loading = ref(false)
const modal = ref(false)
const state = ref({
  server: null,
  role: null
})

const vip = ref(configStore.config.vip)

const gift = computed(() => {
  if(!authStore.isLogin) return false
  if(!props.user) return null
  if(authStore.profile._id != props.user._id) return false
  if(!props.user.vip) return null
  if(!props.user.vip.enable) return null
  if(!!props.user.vip.gift) return null
  if(!vip.value.gift) return null
  if(vip.value.gift.length == 0) return null

  if(props.user.vip.type == 'day') return vip.value.gift
  if(props.user.vip.type == 'forever') return vip.value.gift.map(item => ({
    ...item,
    amount: item.amount * 2
  }))
  return null
})

const isActiveBtn = computed(() => {
  if(!gift.value) return false
  if(!state.value.server) return false
  // if(!state.value.role) return false
  return true
})

const open = () => {
  if(!gift.value) return false
  modal.value = true
}

const submit = async () => {
  try {
    loading.value = true

    await useAPI('auth/public/vip/gift', state.value)
    loading.value = false
    modal.value = false
    emits('gift')
  }
  catch(e){
    loading.value = false
  }
}
</script>