<template>
  <UiContent :title="t('menuManageConfigMenu')" :sub="t('menuManageConfigMenuInfo')" class="max-w-3xl mx-auto">
    <UCard class="mb-4">
      <UiText color="primary" weight="bold" class="mb-4">{{ t('menuAbout') }}</UiText>

      <UiFlex justify="between" class="mb-4">
        <UiText size="sm">{{ t('menuAboutLevel') }}</UiText>
        <UToggle v-model="state.menu.about.level" />
      </UiFlex>

      <UiFlex justify="between">
        <UiText size="sm">{{ t('menuVip') }}</UiText>
        <UToggle v-model="state.menu.action.vip" />
      </UiFlex>
    </UCard>

    <UCard class="mb-4">
      <UiText color="primary" weight="bold" class="mb-4">{{ t('manageConfigMenuAction') }}</UiText>

      <UiFlex justify="between" class="mb-4">
        <UiText size="sm">{{ t('menuPayment') }}</UiText>
        <UToggle v-model="state.menu.action.payment" />
      </UiFlex>

      <UiFlex justify="between">
        <UiText size="sm">{{ t('menuGiftcode') }}</UiText>
        <UToggle v-model="state.menu.action.giftcode" />
      </UiFlex>
    </UCard>

    <UCard class="mb-4">
      <UiText color="primary" weight="bold" class="mb-4">{{ t('menuShop') }}</UiText>

      <UiFlex justify="between" class="mb-4">
        <UiText size="sm">{{ t('menuShopRecharge') }}</UiText>
        <UToggle v-model="state.menu.shop.recharge" />
      </UiFlex>

      <UiFlex justify="between" class="mb-4">
        <UiText size="sm">{{ t('menuShopItem') }}</UiText>
        <UToggle v-model="state.menu.shop.item" />
      </UiFlex>

      <UiFlex justify="between" class="mb-4">
        <UiText size="sm">{{ t('menuShopPack') }}</UiText>
        <UToggle v-model="state.menu.shop.pack" />
      </UiFlex>
    </UCard>

    <UCard class="mb-4">
      <UiText color="primary" weight="bold" class="mb-4">{{ t('menuEvent') }}</UiText>

      <UiFlex justify="between" class="mb-4">
        <UiText size="sm">{{ t('menuEventPower') }}</UiText>
        <UToggle v-model="state.menu.event.powerup" />
      </UiFlex>

      <UiFlex justify="between" class="mb-4">
        <UiText size="sm">{{ t('menuEventReferral') }}</UiText>
        <UToggle v-model="state.menu.event.referral" />
      </UiFlex>

      <UiFlex justify="between" class="mb-4">
        <UiText size="sm">{{ t('menuEventLogin') }}</UiText>
        <UToggle v-model="state.menu.event.login" />
      </UiFlex>

      <UiFlex justify="between" class="mb-4">
        <UiText size="sm">{{ t('menuEventPay') }}</UiText>
        <UToggle v-model="state.menu.event.pay" />
      </UiFlex>

      <UiFlex justify="between" class="mb-4">
        <UiText size="sm">{{ t('menuEventSpend') }}</UiText>
        <UToggle v-model="state.menu.event.spend" />
      </UiFlex>

      <UiFlex justify="between" class="mb-4">
        <UiText size="sm">{{ t('menuEventPaymusty') }}</UiText>
        <UToggle v-model="state.menu.event.paymusty" />
      </UiFlex>

      <UiFlex justify="between" class="mb-4">
        <UiText size="sm">{{ t('menuEventPaydays') }}</UiText>
        <UToggle v-model="state.menu.event.paydays" />
      </UiFlex>
    </UCard>

    <UCard class="mb-4">
      <UiText color="primary" weight="bold" class="mb-4">{{ t('menuMinigame') }}</UiText>

      <UiFlex justify="between" class="mb-4">
        <UiText size="sm">{{ t('menuMinigameWheel') }}</UiText>
        <UToggle v-model="state.menu.minigame.wheel" />
      </UiFlex>

      <UiFlex justify="between">
        <UiText size="sm">{{ t('menuMinigameEgg') }}</UiText>
        <UToggle v-model="state.menu.minigame.egg" />
      </UiFlex>
    </UCard>

    <UCard>
      <UiText color="primary" weight="bold" class="mb-4">{{ t('menuRank') }}</UiText>

      <UiFlex justify="between" class="mb-4">
        <UiText size="sm">{{ t('menuRankLevel') }}</UiText>
        <UToggle v-model="state.menu.rank.level" />
      </UiFlex>

      <UiFlex justify="between">
        <UiText size="sm">{{ t('menuRankPower') }}</UiText>
        <UToggle v-model="state.menu.rank.power" />
      </UiFlex>
    </UCard>

    <UiFlex justify="end" class="mt-4">
      <UButton class="bg-btn" @click="update('menu')" :loading="updating">{{ t('update') }}</UButton>
    </UiFlex>
  </UiContent>
</template>

<script setup>
const { t } = useI18n()
const { bootConfig } = useConfigStore()

const load = ref(true)
const updating = ref(false)

const state = ref({
  change: null,

  menu: {
    about: {
      level: false
    },
    action: {
      payment: false,
      giftcode: false,
      vip: false
    },
    shop: {
      pack: false,
      item: false,
      recharge: false
    },
    event: {
      powerup: false,
      referral: false,
      login: false,
      pay: false,
      spend: false,
      paymusty: false,
      paydays: false
    },
    minigame: {
      wheel: false,
      egg: false
    },
    rank: {
      level: false,
      power: false
    }
  }
})

const getConfig = async () => {
  const config = await useAPI('config/manage/get')
  state.value = Object.assign(state.value, config)
  load.value = false
}

const update = async (change) => {
  try {
    updating.value = true
    state.value.change = change

    await useAPI('config/manage/update', state.value)
    bootConfig()
    getConfig()
    updating.value = false
  }
  catch(e) {
    updating.value = false
  }
}

getConfig()
</script>