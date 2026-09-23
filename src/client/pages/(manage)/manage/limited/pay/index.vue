<template>
  <UiContent :title="t('menuManageLimitedPay')" :sub="t('menuManageLimitedPayInfo')" class="max-w-3xl mx-auto">
    <template #more>
      <UButton color="gray" size="xs" class="ml-auto" @click="navigateTo('/manage/limited/pay/history')">
        {{ t('history') }}
      </UButton>
    </template>

    <UAccordion
      color="primary"
      variant="soft"
      size="md"
      :items="menu"
    >
      <template #default="{ item, open }">
        <UButton size="md" class="bg-card-box mb-1">
          <UiText class="text-white" :class="{
            '!text-gray-400': !open,
            '!text-primary-400': !!open
          }">{{ item.label }}</UiText>
        </UButton>
      </template>

      <template #config>
        <UCard>
          <UForm @submit="update" :state="state">
            <UiFlex justify="between" class="mb-4">
							<UiText weight="semibold" size="sm">{{ t('active') }}</UiText>
							<UToggle v-model="state.time.active" />
						</UiFlex>

						<UiFlex class="gap-1">
							<SelectDate time v-model="state.time.start" :placeholder="t('start')" class="grow" />
							<SelectDate time v-model="state.time.end" :placeholder="t('end')" class="grow" />
						</UiFlex>
          </UForm>
        </UCard>
      </template>

      <template #need>
        <UCard>
          <UForm @submit="update" :state="state">
            <UFormGroup :label="t('manageLimitedPayNeedReward')">
              <SelectItemListValue v-model="state.reward" />
            </UFormGroup>
          </UForm>
        </UCard>
      </template>
    </UAccordion>

    <UiFlex justify="between" class="gap-1">
      <UButton color="rose" variant="outline" @click="modal.reset = true">{{ t('reset') }}</UButton>
      <UButton class="bg-btn" @click="update" :loading="loading.update">{{ t('update') }}</UButton>
    </UiFlex>

		<UModal v-model="modal.reset" preventClose>
      <UiContent :title="t('reset')" class="bg-card rounded-2xl p-4" no-dot>
        <UAlert :title="t('attention')" icon="i-bxs-info-circle" color="rose" variant="soft">
          <template #description>
            {{ t('manageLimitedPayResetInfo') }}
          </template>
        </UAlert>

        <UiFlex class="mt-4" justify="end">
          <UButton @click="reset" :loading="loading.update" color="rose">{{ t('confirm') }}</UButton>
          <UButton color="gray" @click="modal.reset = false" :disabled="!!loading.update" class="ml-1">{{ t('close') }}</UButton>
        </UiFlex>
      </UiContent>
    </UModal>
  </UiContent>
</template>

<script setup>
const { t } = useI18n()

const loading = ref({
  load: true,
  update: false
})

const modal = ref({
	reset: false
})

const menu = computed(() => [
  { label: t('config'), slot: 'config', defaultOpen: true },
  { label: t('limitedPayNeed'), slot: 'need' },
])

const state = ref({
  time: {
		active: false,
		start: null,
		end: null,
	},
	reward: []
})

const update = async () => {
  try {
    loading.value.update = true

    await useAPI('limited/pay/manage/update', state.value)
    getConfig()
    loading.value.update = false
  }
  catch(e) {
    loading.value.update = false
  }
}

const reset = async () => {
  try {
    loading.value.update = true

    await useAPI('limited/pay/manage/reset')
    getConfig()
    loading.value.update = false
		modal.value.reset = false
  }
  catch(e) {
    loading.value.update = false
  }
}

const getConfig = async () => {
  const config = await useAPI('limited/pay/manage/get')
  state.value = Object.assign(state.value, config)
}

getConfig()
</script>