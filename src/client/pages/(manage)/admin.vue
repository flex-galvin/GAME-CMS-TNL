<template>
  <UiFlex type="col" justify="center" class="p-6 w-full min-h-screen">
    <div class="bg-card-box rounded-2xl p-4 min-w-[350px]">
      <div class="mb-4">
        <UiText size="base" weight="semibold">{{ t('adminVerify') }}</UiText>
        <UiText size="sm" color="gray">{{ t('adminVerifyInfo') }}</UiText>
      </div>

      <UForm :state="state" @submit="submit">
        <UFormGroup>
          <UInput v-model="state.password" icon="i-bxs-lock" type="password" :disabled="loading" />
        </UFormGroup>

        <UiFlex justify="between" class="mt-4">
          <UButton variant="link" color="green" :disabled="!!loading" @click="getOTP">{{ t('adminVerifyGetOTP') }}</UButton>
          <UButton class="bg-btn" type="submit" :loading="loading">{{ t('confirm') }}</UButton>
        </UiFlex>
      </UForm>
    </div>
  </UiFlex>
</template>

<script setup>
definePageMeta({
  layout: false,
  middleware: 'whitelist'
})

useSeoMeta({
  robots: 'none'
})

const { t } = useI18n()
const loading = ref(false)

const state = ref({
  password: null
})

const getOTP = async () => {
  try {
    loading.value = true
    await useAPI('auth/manage/otp')

    loading.value = false
  }
  catch(e){
    loading.value = false
  }
}

const submit = async () => {
  try {
    loading.value = true
    const link = await useAPI('auth/manage/verify', state.value)
    useTo().navigateToSSL(link)
  }
  catch(e){
    loading.value = false
  }
}
</script>