<template>
  <UForm :validate="validate" :state="state" @submit="submit">
    <UFormGroup name="code" class="mb-0">
      <UiFlex justify="between" class="bg-card-box rounded-2xl p-4 md:p-6 gap-4">
        <UInput v-model="state.code" class="grow" size="xl" variant="none" :placeholder="t('giftcodeInputPlaceholder')" :ui="{ padding: { xl: 'px-0' } }"/>
        <UButton type="submit" :loading="loading" class="bg-btn sm:text-base sm:px-4 sm:py-2">{{ t('check') }}</UButton>
      </UiFlex>
    </UFormGroup>

    <UFormGroup name="public" class="mt-4" v-show="!!giftcodes && giftcodes.length > 0">
      <div class="overflow-hidden" :class="{ 'HideScroll max-h-[45vh] overflow-y-auto p-0.5' : !!scroll }">
        <DataGiftcodePublic v-model:giftcodes="giftcodes" @fast="onFast" />
      </div>
    </UFormGroup>

    <UModal v-model="modal.receive" prevent-close>
      <DataGiftcodeReceive :giftcode="giftcode" @done="doneReceive" @close="modal.receive = false" class="p-4" />
    </UModal>
  </UForm>
</template>

<script setup>
const { t } = useI18n()

const props = defineProps({
  scroll: Boolean
})

const authStore = useAuthStore()

const loading = ref(false)

const modal = ref({
  receive: false
})

const giftcodes = ref(undefined)
const giftcode = ref(undefined)

const state = ref({
  code: null
})

const doneReceive = () => {
  modal.value.receive = false
  state.value.code = null
}

const validate = (state) => {
  const errors = []
  if(!state.code) errors.push({ path: 'code', message: t('errorInputEmpty') })
  return errors
}

const onFast = (code) => {
  if(!!loading.value) return useNotify().error(t('giftcodeProcessing'))
  state.value.code = code
  submit()
}

const submit = async () => {
  try {
    if(!authStore.isLogin) return useNotify().error(t('errorAuthEmpty'))
    loading.value = true
    const post = JSON.parse(JSON.stringify(state.value))
    const data = await useAPI('giftcode/public/get', {
      code: post.code
    })

    giftcode.value = data
    loading.value = false
    modal.value.receive = true
  }
  catch (e) {
    loading.value = false
  }
}
</script>