<template>
  <UForm @submit="submit" :validate="validate" :state="state">
    <UFormGroup :label="t('server')" name="server">
      <SelectGameServer v-model="state.server" />
    </UFormGroup>

    <UFormGroup :label="t('role')" name="role" v-if="!!state.server && !!state.user">
      <SelectGameRole v-model="state.role" :server="state.server" :user="state.user" />
    </UFormGroup>

    <UiFlex class="gap-2">
      <UFormGroup :label="t('title')" name="title" class="grow">
        <UInput v-model="state.title" />
      </UFormGroup>

      <UFormGroup :label="t('content')" name="content" class="grow">
        <UInput v-model="state.content" />
      </UFormGroup>
    </UiFlex>

    <UFormGroup :label="t('reason')" name="reason">
      <UInput v-model="state.reason" />
    </UFormGroup>

    <UFormGroup name="items">
      <SelectItemList  v-model="state.items" :types="['coin', 'wheel', 'game_item']" />
    </UFormGroup>

    <UiFlex justify="end" class="gap-1">
      <UButton color="yellow" type="submit" :loading="loading">{{ t('send') }}</UButton>
      <UButton color="gray" @click="emits('close')">{{ t('close') }}</UButton>
    </UiFlex>
  </UForm>
</template>

<script setup>
const { t } = useI18n()
const authStore = useAuthStore()
const props = defineProps(['user', 'server'])
const emits = defineEmits(['close'])
const loading = ref(false)

const state = ref({
  user: props.user,
  server: props.server || null,
  role: null,
  title: t('manageGameSendItemTitleDefault'),
  content: t('manageGameSendItemContentDefault'),
  reason: authStore.profile.type > 1 ? t('manageGameSendItemReasonDefault') : null,
  items: []
})

const validate = (state) => {
  const errors = []
  if(!state.user) errors.push({ path: 'user', message: t('errorInputEmpty') })
  if(!state.server) errors.push({ path: 'server', message: t('errorSelectServer') })
  if(!!state.server && !state.role) errors.push({ path: 'role', message: t('errorSelectRole') })
  if(!state.reason) errors.push({ path: 'reason', message: t('errorInputEmpty') })
  // if(state.items.length < 1) errors.push({ path: 'items', message: t('errorInputEmpty') })
  return errors
}

const submit = async () => {
  try {
    loading.value = true
    await useAPI('game/manage/send/single', state.value)

    loading.value = false
    emits('close')
  }
  catch(e) {
    loading.value = false
  }
}
</script>