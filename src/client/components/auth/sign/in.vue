<template>
  <UForm :validate="validate" :state="state" @submit="submit">
    <UFormGroup :label="t('username')" name="username">
      <UInput icon="i-bxs-user" v-model="state.username" />
    </UFormGroup>

    <UFormGroup :label="t('password')" name="password">
      <UInput icon="i-bxs-lock" v-model="state.password" type="password" />
    </UFormGroup>

    <UFormGroup :label="t('captcha')" name="captcha" v-if="!!siteKey">
      <div :ref="turnstile.el"></div>
    </UFormGroup>

    <UiFlex justify="between" class="mt-6">
      <UiText pointer size="sm" color="gray" :disabled="!!loading" @click="emits('up')">{{ t('toSignUp') }}</UiText>
      <UButton type="submit" size="lg" :loading="loading" class="bg-btn">{{ t('signIn') }}</UButton>
    </UiFlex>
  </UForm>
</template>

<script setup>
const { t } = useI18n()
const configStore = useConfigStore()
const emits = defineEmits(['done', 'up'])

const loading = ref(false)

const state = ref({
  username: undefined,
  password: undefined,
  captcha: undefined,
})

const siteKey = computed(() => configStore.config.cloudflare?.site_key) 
const turnstile = useCFTurnstile({
  siteKey: configStore.config.cloudflare?.site_key,
  onSuccess: (t) => state.value.captcha = t
})

const validate = (state) => {
  const errors = []
  if (!state.username) errors.push({ path: 'username', message: t('errorInputEmpty') })
  if (!state.password) errors.push({ path: 'password', message: t('errorInputEmpty') })
  if (!state.captcha && !!siteKey.value) errors.push({ path: 'captcha', message: t('errorInputCaptcha') })
  return errors
}

const submit = async () => {
  try {
    loading.value = true
    await useAPI('auth/public/sign/in', state.value)

    loading.value = false
    emits('done')
  }
  catch (e) {
    loading.value = false
    turnstile.reset()
  }
}
</script>