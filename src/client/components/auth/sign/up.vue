<template>
  <UForm
    :validate="validate"
    :state="state"
    @submit="submit"
  >
    <UFormGroup :label="t('username')" :hint="`${state.username ? state.username.length : 0}/15`" name="username">
      <UInput icon="i-bxs-user" v-model="state.username" />
    </UFormGroup>

    <UFormGroup :label="t('email')" name="email">
      <UInput icon="i-bxs-envelope" v-model="state.email" />
    </UFormGroup>

    <UFormGroup :label="t('phone')" name="phone">
      <UInput icon="i-bxs-phone" v-model="state.phone" />
    </UFormGroup>

    <UFormGroup :label="t('password')" :hint="`${state.password ? state.password.length : 0}/15`" name="password">
      <UInput icon="i-bxs-lock" v-model="state.password" type="password" />
    </UFormGroup>

    <UFormGroup :label="t('referralCode')" name="referral_code" v-if="!!configStore.config.enable.referral">
      <UInput icon="i-bx-barcode" v-model="state.referral_code" />
    </UFormGroup>

    <UFormGroup :label="t('captcha')" name="captcha" v-if="!!siteKey">
      <div :ref="turnstile.el"></div>
    </UFormGroup>

    <UiFlex justify="between" class="mt-6">
      <UiText pointer size="sm" color="gray" :disabled="!!loading" @click="emits('in')">{{ t('toSignIn') }}</UiText>
      <UButton type="submit" size="lg" :loading="loading" class="bg-btn">{{ t('signUp') }}</UButton>
    </UiFlex>
  </UForm>
</template>

<script setup>
const { t } = useI18n()
const configStore = useConfigStore()
const emits = defineEmits(['done', 'in'])

const loading = ref(false)

const state = ref({
  username: undefined,
  email: undefined,
  phone: undefined,
  password: undefined,
  referral_code: undefined,
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

  if (!state.email) errors.push({ path: 'email', message: t('errorInputEmpty') })
  else if (!state.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) errors.push({ path: 'email', message: t('errorInputFormat') })

  if (!state.phone) errors.push({ path: 'phone', message: t('errorInputEmpty') })
  else if (!state.phone.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)) errors.push({ path: 'phone', message: t('errorInputFormat') })

  if (!state.password) errors.push({ path: 'password', message: t('errorInputEmpty') })
  else if (state.password.length < 6 || state.password.length > 15) errors.push({ path: 'password', message: t('errorInputPasswordLength') })
  else if (!!state.password.match(/\s/g)) errors.push({ path: 'password', message: t('errorInputSpace') })

  if (!state.captcha && !!siteKey.value) errors.push({ path: 'captcha', message: t('errorInputCaptcha') })

  return errors
}

const submit = async () => {
  try {
    loading.value = true
    await useAPI('auth/public/sign/up', state.value)

    loading.value = false
    emits('done')
  }
  catch (e) {
    loading.value = false
    turnstile.reset()
  }
}
</script>