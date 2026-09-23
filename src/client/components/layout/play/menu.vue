<template>
  <div>
    <UiFlex justify="center" class="gap-1 sm:gap-2 flex-wrap w-full max-w-[500px] p-2">
      <UiEffectOb v-for="(item, index) in menu" :key="index" >
        <UButton 
          class="dark:!bg-black/60 flex flex-col justify-center h-28 w-28 !text-white hover:scale-95 ease-out duration-200 px-1"
          @click="item.click()"
        >
          <UiIcon :name="item.icon" :color="item.color" class="h-10 w-10 mb-2" />
          <UiText weight="semibold" :color="item.color" class="text-sm" mini>{{ item.title }}</UiText>
        </UButton>
      </UiEffectOb>
    </UiFlex>

    <!-- Modal -->
    <div class="w-[0] h-[0] hidden">
      <UModal v-model="modal.admin.user" :ui="{ width: 'sm:max-w-[700px]' }">
        <ManageUserInfo v-if="route.query.user" :user="route.query.user" @close="modal.admin.user = false"/>
      </UModal>

      <UModal v-model="modal.admin.mail" preventClose :ui="{ width: 'sm:max-w-[700px]' }">
        <PlayModal :title="t('gameSendMail')" :sub="t('gameSendMailInfo')" @close="modal.admin.mail = false">
          <ManageGameSend v-if="route.query.user" :user="route.query.user" :role="route.query.role || null" :server="route.query.server || null" @close="modal.admin.mail = false" />
        </PlayModal>
      </UModal>

      <UModal v-model="modal.user" :ui="{width: 'sm:max-w-[500px]'}">
        <DataUserInfo @close="modal.user = false" />
      </UModal>

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
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()

const props = defineProps(['admin'])
const route = useRoute()
const authStore = useAuthStore()
const configStore = useConfigStore()
const show = ref(configStore.config.menu)

const modal = ref({
  admin: {
    user: false,
    mail: false
  },
  user: false,
  payment: false,
  giftcode: false,
  shop: false,
  event: false,
  minigame: false,
  rank: false
})

const menu = computed(() => { 
  const dataManage = []
  if(authStore.profile.type > 0){
    dataManage.push({ 
      title: t('menuManage'), 
      icon: 'i-mdi-administrator', 
      color: 'green',
      click: () => useTo().navigateToSSL('/manage')
    })

    if(!!props.admin && !!route.query.user){
      dataManage.push({ 
        title: t('menuAuth'), 
        icon: 'i-bxs-user', 
        click: () => modal.value.admin.user = true 
      })
      dataManage.push({ 
        title: t('gameSendMail'), 
        icon: 'i-bxs-envelope', 
        click: () => modal.value.admin.mail = true 
      })
    }
  }

  const dataDefault = [
    { 
      title: t('menuAuth'),
      icon: 'i-bxs-user', 
      disabled: !!props.admin,
      click: () => modal.value.user = true 
    },
    { 
      title: t('menuPayment'),
      icon: 'i-bxs-credit-card', 
      disabled: !!props.admin || !show.value.action.payment, 
      click: () => modal.value.payment = true 
    },
    { 
      title: t('menuGiftcode'), 
      icon: 'i-bxs-barcode', 
      disabled: !!props.admin || !show.value.action.giftcode, 
      click: () => modal.value.giftcode = true 
    },
    { 
      title: t('menuShop'), 
      icon: 'i-bxs-shopping-bag', 
      disabled: !!props.admin || (!show.value.shop.item && !show.value.shop.pack && !show.value.shop.recharge), 
      click: () => modal.value.shop = true 
    },
    { 
      title: t('menuEvent'), 
      icon: 'i-bxs-calendar', 
      disabled: !!props.admin || (!show.value.event.powerup 
        && show.value.event.login 
        && show.value.event.pay 
        && show.value.event.paydays 
        && show.value.event.paymusty 
        && show.value.event.referral 
        && show.value.event.spend), 
      click: () => modal.value.event = true 
    },
    { 
      title: t('menuMinigame'), 
      icon: 'i-bxs-game', 
      disabled: !!props.admin || (!show.value.minigame.egg && !show.value.minigame.wheel), 
      click: () => modal.value.minigame = true 
    },
    { 
      title: t('menuRank'), 
      icon: 'i-bxs-bar-chart-alt-2', 
      disabled: !show.value.rank.level && !show.value.rank.power, 
      click: () => modal.value.rank = true 
    }
  ]

  const dataExit = []
  if(!!props.admin){
    dataExit.push({
      title: t('exit'), 
      icon: 'i-mdi-power',
      color: 'rose',
      click: () => useTo().navigateToSSL('/manage/game/roles')
    })
  }
  else {
    if(!!configStore.config.enable.landing) dataExit.push({
      title: t('signOut'), 
      icon: 'i-mdi-power',
      color: 'rose',
      click: () => authStore.removeAuth()
    })
    else dataExit.push({
      title: t('exit'),
      icon: 'i-mdi-power',
      color: 'rose',
      click: () => useTo().navigateToSSL('/')
    })
  }

  return [ ...dataManage, ...dataDefault.map(section => {
    if (!section.disabled) return { ...section }
    else return null
  }).filter(Boolean), ...dataExit ]
})
</script>