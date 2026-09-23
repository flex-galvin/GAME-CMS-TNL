<template>
  <UForm :state="state" :validate="validate" @submit="submit" v-if="!!profile">
    <UFormGroup :label="t('email')" name="email">
      <UInput icon="i-bxs-envelope" v-model="state.email" :disabled="!!profile.email" />
    </UFormGroup>

    <UFormGroup :label="t('phone')" name="phone">
      <UInput icon="i-bxs-phone" v-model="state.phone" :disabled="!!profile.phone" />
    </UFormGroup>

    <UiFlex justify="end">
      <UButton class="bg-btn" type="submit" :loading="loading" v-if="!profile.email || !profile.phone">{{ t('confirm') }}</UButton>
      <UButton color="gray" :disabled="!!loading" @click="emits('close')">{{ t('close') }}</UButton>
    </UiFlex>
  </UForm>
</template>

<script setup>
const { t } = useI18n()
const authStore = useAuthStore()
const props = defineProps(['profile'])
const emits = defineEmits(['done', 'close'])

const loading = ref(false)

const state = ref({
  email: !!props.profile ? props.profile.email : undefined,
  phone: !!props.profile ? props.profile.phone : undefined,
})

const validate = (state) => {
  const errors = []
  if (!props.profile.email && !!state.email && !state.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g)) errors.push({ path: 'email', message: t('errorInputFormat') })
  if (!props.profile.phone && !!state.phone && !state.phone.match(/(84|0[3|5|7|8|9])+([0-9]{8})\b/g)) errors.push({ path: 'phone', message: t('errorInputFormat') })
  return errors
}

const submit = async () => {
  try {
    loading.value = true
    await useAPI('auth/public/update/info', state.value)
    await authStore.setAuth()

    loading.value = false
    emits('done')
  }
  catch (e) {
    loading.value = false
  }
}
</script>