
<template>
  <div class="bg-card rounded-2xl px-4 pb-4 pt-3">
    <DataEmpty class="min-h-[300px]" :loading="loading" v-if="!!loading || !userData" />

    <div v-else>
      <div>
        <UiFlex justify="between" class="mb-2">
          <UiText class="FTV text-gradient text-sm md:text-base">{{ t('menuProfile') }}</UiText>

          <UiFlex class="gap-1">
            <ManageUserAction :user="userData" @done="getUser" />
            <ManageUserReset :user="userData" @done="getUser" />
            <UButton color="gray" icon="i-bx-x" @click="emits('close')" />
          </UiFlex>
        </UiFlex>

        <UiFlex type="col" justify="center" class="bg-card-box rounded-2xl px-6 pb-4">
          <UiFlex justify="center" class="relative mb-4">
            <UiImg :src="userData.avatar || '/images/user/default.png'" :alt="userData.username" class="rounded-full w-[110px] h-[110px] -mt-[70px] md:w-[130px] md:h-[130px] md:-mt-[90px]" />
          </UiFlex>

          <UiText class="OPS text-2xl capitalize" align="center" :color="typeFormat[userData.type].color">{{ userData.username }}</UiText>
          <UiText size="xs" weight="bold" class="-mt-1" color="gray" align="center">{{ typeFormat[userData.type].label }}</UiText>

          <div class="w-full mt-4" v-if="!!processLevel">
            <UiFlex class="mb-1" justify="between">
              <UiText class="text-[0.65rem] md:text-xs" color="gray">{{ processLevel.now }}</UiText>
              <UiText class="text-[0.65rem] md:text-xs" color="gray">{{ processLevel.next }}</UiText>
            </UiFlex>

            <UProgress :value="processLevel.value" color="green" />
          </div>

          <UiFlex justify="between" class="w-full mt-4">
            <UiFlex type="col" class="w-1/4">  
              <UiText weight="bold" size="lg">{{ !!userData.currency ? useMoney().miniMoney(userData.currency.coin) : '...' }}</UiText>
              <UiText class="text-[0.65rem] md:text-xs" color="gray">{{ t('coin') }}</UiText>
            </UiFlex>

            <UiFlex type="col" class="w-1/4">  
              <UiText weight="bold" size="lg">{{ !!userData.currency ? useMoney().miniMoney(userData.currency.wheel) : '...' }}</UiText>
              <UiText class="text-[0.65rem] md:text-xs" color="gray">{{ t('wheel') }}</UiText>
            </UiFlex>

            <UiFlex type="col" class="w-1/4">  
              <UiText weight="bold" size="lg">{{ !!userData.currency ? useMoney().miniMoney(userData.currency.diamond) : '...' }}</UiText>
              <UiText class="text-[0.65rem] md:text-xs" color="gray">{{ t('diamond') }}</UiText>
            </UiFlex>

            <UiFlex type="col" class="w-1/4">  
              <UiText weight="bold" size="lg">{{ !!userData.referral ? useMoney().miniMoney(userData.referral.count) : '...' }}</UiText>
              <UiText class="text-[0.65rem] md:text-xs" color="gray">{{ t('friend') }}</UiText>
            </UiFlex>
          </UiFlex>
        </UiFlex>
      </div>

      <div class="mt-3">
        <UiText class="FTV text-gradient text-sm md:text-base mb-2">{{ t('detailedInformation') }}</UiText>

        <ClientOnly>
          <swiper-container 
            :freeMode="true"
            :spaceBetween="4"
            slidesPerView="auto"
            class="rounded-2xl overflow-hidden mb-2"
            v-if="menu.length > 1"
          >
            <swiper-slide v-for="(option, index) in menu" :key="index" class="!inline-block !w-auto">
              <UiButtonSelect
                @click="tab = option.type"
                :active="!!tab && tab == option.type"
                class="py-2 px-4"
              >
                <UiText weight="bold" class="text-[0.65rem] sm:text-xs md:text-sm">{{ option.label }}</UiText>
              </UiButtonSelect>
            </swiper-slide>
          </swiper-container >
        </ClientOnly>

        <ManageUserInfoLog :user="userData._id" v-if="tab == 'log'" />
        <DataUserStatistical :user="userData._id" v-if="tab == 'statistical'" />
        <ManageUserInfoIp :user="userData._id" v-if="tab == 'ip'" />
        <DataPaymentHistory :user="userData._id" v-if="tab == 'payment'" />
        <DataUserReferral :user="userData._id" v-if="tab == 'referral'" />
        <DataShopHistory :user="userData._id" v-if="tab == 'shop'" />
        <DataEventHistory :user="userData._id" v-if="tab == 'event'" />
        <DataGiftcodeHistory :user="userData._id" v-if="tab == 'giftcode'" />
        <DataMinigameHistory :user="userData._id" v-if="tab == 'minigame'" />
      </div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps({ user: String })
const emits = defineEmits(['close'])

const loading = ref(false)
const userData = ref(undefined)

const typeFormat = {
  0: { label: 'MEMBER', color: 'white' },
  1: { label: 'SMOD', color: 'green' },
  2: { label: 'DEV', color: 'cyan' },
  3: { label: 'ADMIN', color: 'red' },
  99: { label: 'ROBOT', color: 'orange' }
}

const tab = ref('log')
const menu = [
  { label: t('log'), type: 'log' },
  { label: t('statistical'), type: 'statistical' },
  { label: t('ip'), type: 'ip' },
  { label: t('payment'), type: 'payment' },
  { label: t('referral'), type: 'referral' },
  { label: t('menuShop'), type: 'shop' },
  { label: t('menuEvent'), type: 'event' },
  { label: t('menuGiftcode'), type: 'giftcode' },
  { label: t('menuMinigame'), type: 'minigame' },
]

const processLevel = computed(() => {
  if(!userData.value) return false
  if(!userData.value.pay) return false
  if(!userData.value.spend) return false
  if(!userData.value.level) return false
  if(!userData.value.level.now) return false
  const nowLevel = userData.value.level.now
  const nextLevel = userData.value.level.next
  if(!nextLevel) return { value: 100, now: `${nowLevel.title} (${nowLevel.number})`, next: t('levelMax')}
  else {
    const myLogin = userData.value.login?.total > nextLevel.need?.login ? nextLevel.need?.login : userData.value.login?.total
    const myPay = userData.value.pay?.total?.money > nextLevel.need?.pay?.money ? nextLevel.need?.pay?.money : userData.value.pay?.total?.money
    const mySpend = userData.value.spend?.total?.coin > nextLevel.need?.spend?.coin ? nextLevel.need?.spend?.coin : userData.value.spend?.total?.coin

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

const getUser = async () => {
  try {
    if(!props.user) throw true
    loading.value = true
    const get = await useAPI('user/public/profile', { _id: props.user })

    userData.value = get
    loading.value = false
  }
  catch(e) {
    userData.value = false
    loading.value = false
  }
}

onMounted(() => setTimeout(getUser, 1))
</script>