<template>
  <UiContent :title="t('menuManageLimitedLootchest')" :sub="t('menuManageLimitedLootchestInfo')" class="max-w-3xl mx-auto">
    <UCard>
      <UForm @submit="update" :state="state">
        <UiFlex justify="between" class="mb-2">
          <UiText weight="semibold" size="sm">{{ t('active') }}</UiText>
          <UToggle v-model="state.time.active" />
        </UiFlex>

        <UiFlex class="gap-1 mb-4">
          <SelectDate time v-model="state.time.start" :placeholder="t('start')" class="grow" />
          <SelectDate time v-model="state.time.end" :placeholder="t('end')" class="grow" />
        </UiFlex>

        <UFormGroup :label="t('manageLimitedLootchestMoneyMin')">
          <UInput v-model="state.money.min" type="number" />
        </UFormGroup>

        <UFormGroup :label="t('manageLimitedLootchestMoneyTarget')">
          <UInput v-model="state.money.need" type="number" />
        </UFormGroup>

        <UFormGroup :label="t('manageLimitedLootchestOwner')">
          <UiFlex class="gap-1">
            <UInput :model-value="state.owner ? state.owner.username : t('nobody')" readonly class="grow" />
            <UInput :model-value="state.money.now > 0 ? useMoney().toMoney(state.money.now) : t('manageLimitedLootchestMoneyNow')" readonly class="grow" />
          </UiFlex>
        </UFormGroup>

        <UFormGroup :label="t('manageLimitedLootchestReward')" v-if="state.reward">
          <SelectItemList v-model="state.reward" :types="['coin', 'wheel', 'game_item']" />
        </UFormGroup>

        <UiFlex justify="between" class="gap-1">
          <UButton color="rose" variant="outline" @click="modal.reset = true">{{ t('reset') }}</UButton>
          <UButton class="bg-btn" @click="update" :loading="loading.update">{{ t('update') }}</UButton>
        </UiFlex>
      </UForm>
    </UCard>

		<UModal v-model="modal.reset" preventClose>
      <UiContent :title="t('reset')" class="bg-card rounded-2xl p-4" no-dot>
        <UAlert :title="t('attention')" icon="i-bxs-info-circle" color="rose" variant="soft">
          <template #description>
           {{ t('manageLimitedLootchestResetInfo') }}
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

const state = ref({
  time: {
		active: false,
		start: null,
		end: null,
	},

  owner: null,

  receive: {
    status: null,
    role: null,
    server: null,
  },

	money: {
    min: 0,
		now: 0,
		need: 0,
	},

	reward: []
})

const update = async () => {
  try {
    loading.value.update = true

    await useAPI('limited/lootchest/manage/update', state.value)
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

    await useAPI('limited/lootchest/manage/reset')
    getConfig()
    loading.value.update = false
		modal.value.reset = false
  }
  catch(e) {
    loading.value.update = false
  }
}

const getConfig = async () => {
  const config = await useAPI('limited/lootchest/manage/get')
  state.value = Object.assign(state.value, config)
}

getConfig()
</script>