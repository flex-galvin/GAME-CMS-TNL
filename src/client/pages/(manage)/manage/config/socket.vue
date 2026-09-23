<template>
  <UiContent :title="t('menuManageConfigSocket')" :sub="t('menuManageConfigSocketInfo')" class="max-w-3xl mx-auto">
    <UAlert :title="t('manageConfigSocketDelChat')" :ui="{ title: 'text-primary font-bold'}" class="bg-card-box mb-4">
      <template #description>
        <UiText size="sm">{{ t('manageConfigSocketDelChatInfo') }}</UiText>
        <UiFlex justify="end">
          <UButton class="bg-btn" :loading="loading.delAllChat" @click="delAllChat">{{ t('run') }}</UButton>
        </UiFlex>
      </template>
    </UAlert>

    <UAlert :title="t('manageConfigSocketUpdateReload')" :ui="{ title: 'text-primary font-bold'}" class="bg-card-box mb-4">
      <template #description>
        <UiText size="sm" class="mb-2">{{ t('manageConfigSocketUpdateReloadInfo') }}</UiText>
        <UiFlex class="gap-1">
          <UInput v-model="noticeReload" class="grow" size="md" :placeholder="t('manageConfigSocketUpdateReloadInput')" />
          <UButton class="bg-btn" :loading="loading.noticeReload" @click="sendNoticeReload">{{ t('run') }}</UButton>
        </UiFlex>
      </template>
    </UAlert>

    <UAlert :title="t('manageConfigSocketSendNotice')" :ui="{ title: 'text-primary font-bold'}" class="bg-card-box mb-4">
      <template #description>
        <UiText size="sm" class="mb-4">{{ t('manageConfigSocketSendNoticeInfo') }}</UiText>

        <UiEditor v-model="noticeSystem" class="mb-2" />

        <UiFlex justify="end">
          <UButton class="bg-btn" :loading="loading.noticeSystem" @click="sendNoticeSystem">{{ t('run') }}</UButton>
        </UiFlex>
      </template>
    </UAlert>

    <UAlert :title="t('manageConfigSocketNotifyRunning')" :ui="{ title: 'text-primary font-bold'}" class="bg-card-box">
      <template #description>
        <UForm :state="state">
          <UFormGroup :label="t('manageConfigSocketNotifyRunningHello')">
            <UInput v-model="state.notiruning.helloworld" />
          </UFormGroup>

          <UFormGroup :label="t('manageConfigSocketNotifyRunningAccessRole')">
            <UInput v-model="state.notiruning.access.role" type="number" />
          </UFormGroup>

          <UFormGroup :label="t('manageConfigSocketNotifyRunningAccessLevel')">
            <UInput v-model="state.notiruning.access.level" type="number" />
          </UFormGroup>

          <UFormGroup :label="t('manageConfigSocketNotifyRunningPay')">
            <UInput v-model="state.notiruning.pay" type="number" />
          </UFormGroup>

          <UiFlex justify="end">
            <UButton class="bg-btn" @click="update('notiruning')" :loading="updating">{{ t('update') }}</UButton>
          </UiFlex>
        </UForm>
      </template>
    </UAlert>
  </UiContent>
</template>

<script setup>
const { t } = useI18n()
const { bootConfig } = useConfigStore()

const load = ref(true)
const updating = ref(false)

const loading = ref({
  delAllChat: false,
  noticeReload: false,
  noticeSystem: false
})

const state = ref({
  change: null,
  notiruning: {
    helloworld: null,
    access: {
      role: 0,
      level: 0
    },
    pay: 0
  }
})

const noticeReload = ref(t('manageConfigSocketUpdateReloadInfoDefault'))
const noticeSystem = ref(null)

const delAllChat = async () => {
  try {
    loading.value.delAllChat = true
    await useAPI('socket/manage/chat/del-all')

    loading.value.delAllChat = false
  }
  catch (e) {
    loading.value.delAllChat = false
  }
}

const sendNoticeReload = async () => {
  try {
    loading.value.noticeReload = true
    await useAPI('socket/manage/action/notice-reload', {
      notice: noticeReload.value
    })

    loading.value.noticeReload = false
  }
  catch (e) {
    loading.value.noticeReload = false
  }
}

const sendNoticeSystem = async () => {
  try {
    loading.value.noticeSystem = true
    await useAPI('socket/manage/action/notice-system', {
      notice: noticeSystem.value
    })

    loading.value.noticeSystem = false
  }
  catch (e) {
    loading.value.noticeSystem = false
  }
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

const getConfig = async () => {
  const config = await useAPI('config/manage/get')
  state.value = Object.assign(state.value, config)
  load.value = false
}

getConfig()
</script>