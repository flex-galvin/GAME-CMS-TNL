<template>
  <UCard>
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

      <UiFlex justify="end">
        <UButton class="bg-btn" type="submit" :loading="loading">{{ t('confirm') }}</UButton>
      </UiFlex>
    </UForm>
  </UCard>
</template>

<script setup>
const { t } = useI18n()
const configStore = useConfigStore()
const authStore = useAuthStore()
const props = defineProps(['landing'])
const emits = defineEmits(['done'])

const loading = ref(false)

const state = ref({
  username: undefined,
  password: undefined,
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
  if (!state.password) errors.push({ path: 'password', message: t('errorInputEmpty') })
  if (!state.captcha && !!siteKey.value) errors.push({ path: 'captcha', message: t('errorInputCaptcha') })
  return errors
}

const submit = async () => {
  try {
    if(!!loading.value) return
    loading.value = true

    state.value.landing = props.landing
    await useAPI('auth/public/sign/landing/in', state.value)

    await  authStore.setAuth()
    loading.value = false
    emits('done')
  }
  catch (e) {
    loading.value = false
  }
}
</script>