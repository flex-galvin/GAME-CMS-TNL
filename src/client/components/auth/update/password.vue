<template>
  <UForm :validate="validate" :state="state" @submit="submit">
    <UFormGroup :label="t('passwordOld')" name="old">
      <UInput icon="i-bxs-lock" v-model="state.old" type="password"/>
    </UFormGroup>

    <UFormGroup :label="t('passwordNew')" name="new" :hint="`${state.new ? state.new.length : 0}/15`">
      <UInput icon="i-bxs-lock" v-model="state.new" type="password" />
    </UFormGroup>

    <UiFlex justify="end">
      <UButton class="bg-btn" type="submit" :loading="loading">{{ t('confirm') }}</UButton>
      <UButton color="gray" :disabled="!!loading" @click="emits('close')">{{ t('close') }}</UButton>
    </UiFlex>
  </UForm>
</template>

<script setup>
const { t } = useI18n()
const authStore = useAuthStore()
const emits = defineEmits(['done', 'close'])

const loading = ref(false)

const state = ref({
  old: undefined,
  new: undefined
})

const validate = (state) => {
  const errors = []
  if (!state.old) errors.push({ path: 'old', message: t('errorInputEmpty') })
  if (!state.new) errors.push({ path: 'new', message: t('errorInputEmpty') })
  else if (state.new.length < 6 || state.new.length > 15) errors.push({ path: 'new', message: t('errorInputPasswordLength') })
  else if (!!state.new.match(/\s/g)) errors.push({ path: 'new', message: t('errorInputSpace') })
  return errors
}

const submit = async () => {
  try {
    loading.value = true
    await useAPI('auth/public/update/password', state.value)
    await authStore.setAuth()

    loading.value = false
    emits('done')
  }
  catch (e) {
    loading.value = false
  }
}
</script>