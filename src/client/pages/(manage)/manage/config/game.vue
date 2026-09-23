<template>
  <UiContent :title="t('menuManageConfigGame')" :sub="t('menuManageConfigGameInfo')" class="max-w-3xl mx-auto">
    <UCard>
      <UForm :state="state">
        <UiFlex justify="between" class="mb-4">
          <UiText weight="semibold">{{ t('manageConfigGameIsMobile') }}</UiText>
          <UToggle v-model="state.game.mobile" color="primary" />
        </UiFlex>

        <UiFlex justify="between" class="mb-4">
          <UiText weight="semibold">{{ t('manageConfigGameHangup') }}</UiText>
          <UToggle v-model="state.game.hangup" color="primary" />
        </UiFlex>

        <UiFlex justify="between" class="mb-4">
          <UiText weight="semibold">{{ t('manageConfigGameLandscape') }}</UiText>
          <UToggle v-model="state.game.landscape" color="primary" />
        </UiFlex>

        <UiFlex justify="between" class="mb-4">
          <UiText weight="semibold">{{ t('manageConfigGameSSL') }}</UiText>
          <UToggle v-model="state.game.ssl" color="primary" />
        </UiFlex>

        <UFormGroup :label="t('manageConfigGameIP')">
          <UInput v-model="state.game.ip" />
        </UFormGroup>

        <UFormGroup :label="t('manageConfigGameSecret')">
          <UInput v-model="state.game.secret" />
        </UFormGroup>

        <UFormGroup :label="t('manageConfigGameRegAPI')">
          <UInput v-model="state.game.api.reg" :placeholder="t('manageConfigGameRegAPIInfo')" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-4">
          <UButton class="bg-btn" @click="update('game')" :loading="updating">{{ t('update') }}</UButton>
        </UiFlex>
      </UForm>
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

  game: {
    ip: '',
    mobile: false,
    hangup: false,
    landscape: false,
    ssl: false,
    secret: '',
    api: {
      reg: ''
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