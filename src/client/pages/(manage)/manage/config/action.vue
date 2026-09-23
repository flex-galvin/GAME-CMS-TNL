<template>
  <UiContent :title="t('menuManageConfigAction')" :sub="t('menuManageConfigActionInfo')" class="max-w-3xl mx-auto">
    <UCard>
      <UiFlex justify="between" class="gap-1 mb-3">
        <UiText weight="semibold" size="sm">{{ t('manageConfigActionMakeKey') }}</UiText>
        <UButton size="sm" class="bg-btn" @click="makekey" :loading="loading.makekey">{{ t('action') }}</UButton>
      </UiFlex>

      <UiFlex justify="between" class="gap-1 mb-3">
        <UiText weight="semibold" size="sm">{{ t('manageConfigActionReopen') }}</UiText>
        <UButton size="sm" class="bg-btn" @click="modal.reopen = true" :loading="loading.reopen">{{ t('action') }}</UButton>
      </UiFlex>

      <div class="space-y-2">
        <UiText weight="semibold" size="sm">{{ t('manageConfigActionDeletePayment') }}</UiText>
        
        <UForm :state="stateDeletePayment" @submit="deletePayment" >
          <UiFlex class="gap-2">
            <UFormGroup :label="t('start')" class="grow">
              <SelectDate time v-model="stateDeletePayment.start" />
            </UFormGroup>

            <UFormGroup :label="t('end')" class="grow">
              <SelectDate time v-model="stateDeletePayment.end" />
            </UFormGroup>
          </UiFlex>

          <UFormGroup :label="t('keep')">
            <UInput v-model="stateDeletePayment.keep" type="number" />
          </UFormGroup>

          <UiFlex justify="end" class="gap-1">
            <UButton type="submit" class="bg-btn" :loading="loading.deletepayment">{{ t('confirm') }}</UButton>
          </UiFlex>
        </UForm>
      </div>
    </UCard>

    <UModal v-model="modal.reopen" preventClose>
      <UiContent title="Reopen" class="bg-card rounded-2xl p-4" no-dot>
        <UAlert :title="t('attention')" icon="i-bxs-info-circle" color="rose" variant="soft">
          <template #description>{{ t('manageConfigActionReopenConfirm') }}</template>
        </UAlert>

        <UiFlex class="mt-4" justify="end">
          <UButton @click="reopen" :loading="loading.reopen" color="rose">{{ t('confirm') }}</UButton>
          <UButton color="gray" @click="modal.reopen = false" :disabled="!!loading.reopen" class="ml-1">{{ t('close') }}</UButton>
        </UiFlex>
      </UiContent>
    </UModal>
  </UiContent>
</template>

<script setup>
const { t } = useI18n()

const loading = ref({
  reopen: false,
  makekey: false,
  deletepayment: false
})

const modal = ref({
  reopen: false
})

const stateDeletePayment = ref({
  start: null,
  end: null,
  keep: 0
})

const reopen = async () => {
  try {
    loading.value.reopen = true

    await useAPI('config/manage/reopen')
    loading.value.reopen = false
    modal.value.reopen = false
  }
  catch (e) {
    loading.value.reopen = false
  }
}

const makekey = async () => {
  try {
    loading.value.makekey = true

    await useAPI('config/manage/makekey')
    loading.value.makekey = false
  }
  catch (e) {
    loading.value.makekey = false
  }
}

const deletePayment = async () => {
  try {
    loading.value.deletepayment = true

    await useAPI('config/manage/deletepayment', JSON.parse(JSON.stringify(stateDeletePayment.value)))
    loading.value.deletepayment = false
  }
  catch (e) {
    loading.value.deletepayment = false
  }
}
</script>