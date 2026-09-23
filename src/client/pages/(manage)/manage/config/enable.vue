<template>
  <UiContent :title="t('menuManageConfigEnable')" :sub="t('menuManageConfigEnableInfo')" class="max-w-3xl mx-auto">
    <UCard>
      <UiFlex justify="between" class="mb-4">
        <UiText weight="semibold" size="sm">{{ t('login') }}</UiText>
        <UToggle v-model="state.enable.signin" />
      </UiFlex>

      <UiFlex justify="between" class="mb-4">
        <UiText weight="semibold" size="sm">{{ t('register') }}</UiText>
        <UToggle v-model="state.enable.signup" />
      </UiFlex>

      <UiFlex justify="between" class="mb-4">
        <UiText weight="semibold" size="sm">{{ t('referral') }}</UiText>
        <UToggle v-model="state.enable.referral" />
      </UiFlex>

      <UiFlex justify="between" class="mb-4">
        <UiText weight="semibold" size="sm">{{ t('manageConfigEnablePlay') }}</UiText>
        <UToggle v-model="state.enable.play" />
      </UiFlex>

      <div class="mb-4">
        <UiFlex justify="between" class="mb-2">
          <UiText weight="semibold" size="sm">{{ t('manageConfigEnableLandingHome') }}</UiText>
          <UToggle v-model="state.enable.landing" />
        </UiFlex>

        <SelectAdsLanding v-model="state.homepage.landing" class="mt-1.5" v-if="!!state.enable.landing" />
      </div>

      <div class="mb-4">
        <UiText weight="semibold" size="sm">{{ t('manageConfigActionGMPassword') }}</UiText>
        <UInput v-model="state.gm_password" class="mt-1.5" />
      </div>

      <div class="mb-4">
        <UiText weight="semibold" size="sm">{{ t('manageConfigEnableRegisterIP') }}</UiText>
        <UInput v-model="state.enable.signup_count" class="mt-1.5" />
      </div>

      <div class="mb-4">
        <UiText weight="semibold" size="sm">{{ t('manageConfigActionGameMore') }}</UiText>
        <UInput v-model="state.more_game" class="mt-1.5" />
      </div>

      <div>
        <UiText weight="semibold" size="sm">{{ t('manageConfigEnableThankyouEnd') }}</UiText>
        <UInput v-model="state.thankyou.link" class="mt-1.5" />
      </div>

      <UiFlex justify="end" class="mt-4">
        <UButton class="bg-btn" @click="update('enable')" :loading="updating">{{ t('update') }}</UButton>
      </UiFlex>
    </UCard>
  </UiContent>
</template>

<script setup>
const { t } = useI18n()
const { bootConfig } = useConfigStore()

const load = ref(true)
const updating = ref(false)

const state = ref({
  change: null,

  more_game: '',

  gm_password: '',

  enable: {
    signin: true,
    signup: true,
    play: true,
    referral: true,
    landing: false,
    signup_count: 0
  },

  homepage: {
    landing: null
  },

  thankyou: {
    link: ''
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