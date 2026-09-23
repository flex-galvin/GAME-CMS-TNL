<template>
  <UCard>
    <UForm :validate="validate" :state="state" @submit="submit">
      <UFormGroup :label="t('username')" :hint="`${state.username ? state.username.length : 0}/15`" name="username">
        <UInput icon="i-bxs-user" v-model="state.username" />
      </UFormGroup>

      <UFormGroup :label="t('password')" :hint="`${state.password ? state.password.length : 0}/15`" name="password">
        <UInput icon="i-bxs-lock" v-model="state.password" type="password" />
      </UFormGroup>

      <UFormGroup :label="t('passwordConfirm')" name="confirm_password">
        <UInput icon="i-bxs-lock-alt" v-model="state.confirm_password" type="password" />
      </UFormGroup>

      <UFormGroup :label="t('captcha')" name="captcha" v-if="!!siteKey">
        <div :ref="turnstile.el"></div>
      </UFormGroup>

      <UiFlex justify="end">
        <UButton class="bg-btn" type="submit" :loading="loading">{{ t('confirm') }}</UButton>
      </UiFlex>
    </UForm>
  </UCard>
</template>

<script setup>
const { t } = useI18n()
const authStore = useAuthStore()
const configStore = useConfigStore()
const props = defineProps(['landing'])
const emits = defineEmits(['done'])

const loading = ref(false)

const state = ref({
  username: undefined,
  password: undefined,
  confirm_password: undefined,
  landing: undefined,
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
  else if (state.username.length < 6 || state.username.length > 12) errors.push({ path: 'username', message: t('errorInputUsernameLength') })
  else if (!!state.username.match(/\s/g)) errors.push({ path: 'username', message: t('errorInputSpace') })
  else if (!(/^[a-z0-9]*$/g).test(state.username)) errors.push({ path: 'username', message: t('errorInputUsernameSpecial') })
  else if (!!state.username.includes('admin')
    || !!state.username.includes('smod')
    || !!state.username.includes('robot')
  ) errors.push({ path: 'username', message: t('errorInputUsernameGM') })

  if (!state.password) errors.push({ path: 'password', message: t('errorInputEmpty') })
  else if (state.password.length < 6 || state.password.length > 15) errors.push({ path: 'password', message: t('errorInputPasswordLength') })
  else if (!!state.password.match(/\s/g)) errors.push({ path: 'password', message: t('errorInputSpace') })

  if (!state.confirm_password) errors.push({ path: 'confirm_password', message: t('errorInputEmpty') })
  else if(state.confirm_password != state.password) errors.push({ path: 'confirm_password', message: t('errorInputPasswordConfirm') })
  
  if (!state.captcha && !!siteKey.value) errors.push({ path: 'captcha', message: t('errorInputCaptcha') })

  return errors
}

const submit = async () => {
  try {
    loading.value = true

    state.value.landing = props.landing
    await useAPI('auth/public/sign/landing/up', state.value)
    await authStore.setAuth()

    loading.value = false
    emits('done')
  }
  catch (e) {
    loading.value = false
  }
}
</script>