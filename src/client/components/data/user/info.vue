<template>
  <div class="bg-card rounded-2xl px-4 pb-4 pt-3">
    <DataEmpty class="min-h-[300px]" :loading="loading" v-if="!!loading || !user" />

    <div v-else>
      <div>
        <UiFlex class="mb-2 gap-1">
          <UiText class="FTV text-gradient text-sm md:text-base mr-auto">{{ t('menuProfile') }}</UiText>

          <UDropdown :items="menu">
            <UButton size="xs" icon="i-mingcute-down-fill" color="gray">{{ t('add') }}</UButton>
          </UDropdown>
          <UButton size="xs" icon="i-bx-x" color="gray" @click="emits('close')"></UButton>
        </UiFlex>

        <UiFlex type="col" justify="center" class="bg-card-box rounded-2xl px-6 pb-4">
          <UiFlex justify="center" class="relative">
            <UiImg :src="user.avatar || '/images/user/default.png'" :alt="user.username" :key="state.update" class="rounded-full w-[110px] h-[110px] -mt-[70px] md:w-[130px] md:h-[130px] md:-mt-[90px] mb-4" />
        
            <UiUploadImage v-model="state.avatar" class="inline-flex !absolute right-2 top-2">
              <template #default="{ select, loading }">
                <UButton icon="i-bx-edit" color="gray" size="2xs" :loading="loading" square @click="select"></UButton>
              </template>
            </UiUploadImage>
          </UiFlex>

          <UiText class="OPS text-2xl capitalize" align="center" :color="typeFormat[user.type].color">{{ user.username }}</UiText>
          <UiText size="xs" weight="bold" class="-mt-1" color="gray" align="center">{{ typeFormat[user.type].label }}</UiText>

          <div class="w-full my-4" v-if="!!processLevel">
            <UiFlex class="mb-1" justify="between">
              <UiText class="text-[0.65rem] md:text-xs" color="gray">{{ processLevel.now }}</UiText>
              <UiText class="text-[0.65rem] md:text-xs" color="gray">{{ processLevel.next }}</UiText>
            </UiFlex>

            <UProgress :value="processLevel.value" color="green" />
          </div>

          <UiFlex justify="between" class="w-full">
            <UiFlex type="col" class="w-1/4">  
              <UiText weight="bold" size="lg">{{ !!user.currency ? useMoney().miniMoney(user.currency.coin) : '...' }}</UiText>
              <UiText class="text-[0.65rem] md:text-xs" color="gray">{{ t('coin') }}</UiText>
            </UiFlex>

            <UiFlex type="col" class="w-1/4">  
              <UiText weight="bold" size="lg">{{ !!user.currency ? useMoney().miniMoney(user.currency.wheel) : '...' }}</UiText>
              <UiText class="text-[0.65rem] md:text-xs" color="gray">{{ t('wheel') }}</UiText>
            </UiFlex>

            <UiFlex type="col" class="w-1/4">  
              <UiText weight="bold" size="lg">{{ !!user.currency ? useMoney().miniMoney(user.currency.diamond) : '...' }}</UiText>
              <UiText class="text-[0.65rem] md:text-xs" color="gray">{{ t('diamond') }}</UiText>
            </UiFlex>

            <UiFlex type="col" class="w-1/4">  
              <UiText weight="bold" size="lg">{{ !!user.referral ? useMoney().miniMoney(user.referral.count) : '...' }}</UiText>
              <UiText class="text-[0.65rem] md:text-xs" color="gray">{{ t('friend') }}</UiText>
            </UiFlex>
          </UiFlex>
        </UiFlex>
      </div>

      <DataUserVip class="mt-3" :user="user" @gift="getUser" />

      <div class="mt-3">
        <UiText class="FTV mb-2 text-gradient text-sm md:text-base">{{ t('userStatistical') }}</UiText>
        <DataUserStatistical />
      </div>
    </div>

    <UModal v-model="modal.info" prevent-close>
      <UiContent class="bg-card rounded-2xl p-4" :title="t('menuProfileChangeInfo')" :sub="t('menuProfileChangeInfoSub')">
        <AuthUpdateInfo :profile="user" @close="modal.info = false" @done="doneEdit" />
      </UiContent>
    </UModal>

    <UModal v-model="modal.password" prevent-close>
      <UiContent class="bg-card rounded-2xl p-4" :title="t('menuProfileChangePassword')" :sub="t('menuProfileChangePasswordSub')">
        <AuthUpdatePassword @close="modal.password = false" @done="doneEdit" />
      </UiContent>
    </UModal>
  </div>
</template>

<script setup>
const { t } = useI18n()
const emits = defineEmits(['close'])

const authStore = useAuthStore()
const user = ref(null)
const loading = ref(true)

const modal = ref({
  password: false,
  info: false
})

const state = ref({
  avatar: null,
  update: 1
})
watch(() => state.value.avatar, async (val) => {
  try {
    if(!val) return
    await useAPI('auth/public/update/avatar', state.value)
    user.value.avatar = state.value.avatar
    state.value.avatar = null
    state.value.update = state.value.update + 1
  }
  catch(e){
    state.value.avatar = null
    state.value.update = state.value.update + 1
  }
})

const menu = computed(() => [
  [{
    label: t('menuProfileChangeInfo'), 
    icon: 'i-bxs-user', 
    click: () =>  modal.value.info = true
  }],
  [{
    label: t('menuProfileChangePassword'), 
    icon: 'i-bxs-lock', 
    click: () => modal.value.password = true
  }]
])

const typeFormat = {
  0: { label: 'MEMBER', color: 'white' },
  1: { label: 'SMOD', color: 'green' },
  2: { label: 'DEV', color: 'cyan' },
  3: { label: 'ADMIN', color: 'red' },
  99: { label: 'ROBOT', color: 'orange' }
}

const processLevel = computed(() => {
  if(!user.value) return false
  if(!user.value.pay) return false
  if(!user.value.spend) return false
  if(!user.value.level) return false
  if(!user.value.level.now) return false
  const nowLevel = user.value.level.now
  const nextLevel = user.value.level.next
  if(!nextLevel) return { value: 100, now: `${nowLevel.title} (${nowLevel.number})`, next: t('levelMax')}
  else {
    const myLogin = user.value.login?.total > nextLevel.need?.login ? nextLevel.need?.login : user.value.login?.total
    const myPay = user.value.pay?.total?.money > nextLevel.need?.pay?.money ? nextLevel.need?.pay?.money : user.value.pay?.total?.money
    const mySpend = user.value.spend?.total?.coin > nextLevel.need?.spend?.coin ? nextLevel.need?.spend?.coin : user.value.spend?.total?.coin

    const processLogin = nextLevel.need?.login > 0 ? Math.round((myLogin / nextLevel.need?.login) * 100) : 0
    const processPay = nextLevel.need?.pay?.money > 0 ? Math.round((myPay / nextLevel.need?.pay?.money) * 100) : 0
    const processSpend = nextLevel.need?.spend?.coin > 0 ? Math.round((mySpend / nextLevel.need?.spend?.coin) * 100) : 0
    const value = Math.round((processLogin + processPay + processSpend) / 3)
    
    return {
      value: value > 100 ? 100 : value,
      now: `${nowLevel.title} (${nowLevel.number})`, 
      next: `${nextLevel.title} (${nextLevel.number})`, 
    }
  }
})

const doneEdit = () => {
  getUser()
  modal.value.info = false
  modal.value.password = false
}

const getUser = async () => {
  try {
    loading.value = true
    const get = await useAPI('user/public/profile', { _id: authStore.profile._id })

    user.value = get
    setTimeout(() => loading.value = false, 500)
  }
  catch(e) {
    user.value = false
    loading.value = false
  }
}
onMounted(() => setTimeout(getUser, 1))
</script>