<template>
  <UiContent :title="t('menuManageLimitedChristmas')" :sub="t('menuManageLimitedChristmasInfo')" class="max-w-3xl mx-auto">
    <template #more>
      <UButton color="gray" size="xs" class="ml-auto" @click="navigateTo('/manage/limited/christmas/history')">{{ t('history') }}</UButton>
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

      <template #jar>
        <UCard>
          <UForm @submit="update" :state="state">
            <UFormGroup :label="t('manageLimitedChristmasJarNow')">
              <UInput v-model="state.jar.now" type="number" />
            </UFormGroup>

            <UFormGroup :label="t('manageLimitedChristmasJarTarget')">
              <UInput v-model="state.jar.target" type="number" />
            </UFormGroup>

            <UFormGroup :label="t('manageLimitedChristmasJarMin')">
              <UInput v-model="state.jar.min" type="number" />
            </UFormGroup>

            <UFormGroup label="Tổng tiền nạp tối thiều để nhận thưởng">
              <UInput v-model="state.jar.payreward" type="number" />
            </UFormGroup>

						<UFormGroup :label="t('manageLimitedChristmasJarShare')">
              <UInput v-model="state.jar.share" type="number" />
            </UFormGroup>

            <UFormGroup :label="t('manageLimitedChristmasJarReward')">
              <SelectItemListStep v-model="state.jar.reward" />
            </UFormGroup>
          </UForm>
        </UCard>
      </template>

      <template #top>
        <UCard>
          <UForm @submit="update" :state="state">
            <UFormGroup :label="t('manageLimitedChristmasTopNeed')">
              <UInput v-model="state.top.need" type="number" />
            </UFormGroup>

            <UFormGroup :label="t('manageLimitedChristmasTopMaxRank')">
              <UInput v-model="state.top.max" type="number" />
            </UFormGroup>

            <UFormGroup :label="t('manageLimitedChristmasTopReward')" v-if="state.top.reward">
              <SelectItemListRank v-model="state.top.reward" />
            </UFormGroup>
          </UForm>
        </UCard>
      </template>

      <template #box>
        <UCard>
          <UForm @submit="update" :state="state">
						<UFormGroup :label="t('manageLimitedChristmasBoxShare')">
              <UInput v-model="state.box.share" type="number" />
            </UFormGroup>

            <UFormGroup :label="t('manageLimitedChristmasBoxReward')">
              <SelectItemListRate :types="['coin', 'wheel', 'game_item']" v-model="state.box.random" />
            </UFormGroup>

            <UFormGroup :label="t('manageLimitedChristmasBoxStepReward')">
              <SelectItemListValue v-model="state.box.reward" />
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
           {{ t('manageLimitedChristmasResetInfo') }}
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
  { label: t('limitedChristmasJar'), slot: 'jar' },
  { label: t('limitedChristmasBox'), slot: 'box' },
	{ label: t('limitedChristmasTop'), slot: 'top' },
])

const state = ref({
  time: {
		active: false,
		start: null,
		end: null,
	},
	jar: {
    min: 0,
		share: 0,
    payreward: 0,
		now: 0,
		target: 0,
		reward: []
	},
	top: {
    need: 0,
		max: 0,
		reward: []
	},
	box: {
		share: 0,
		sticker: 0,
		random: [],
		reward: [],
	}
})

const update = async () => {
  try {
    loading.value.update = true

    await useAPI('limited/christmas/manage/update', state.value)
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

    await useAPI('limited/christmas/manage/reset')
    getConfig()
    loading.value.update = false
		modal.value.reset = false
  }
  catch(e) {
    loading.value.update = false
  }
}

const getConfig = async () => {
  const config = await useAPI('limited/christmas/manage/get')
  state.value = Object.assign(state.value, config)
}

getConfig()
</script>