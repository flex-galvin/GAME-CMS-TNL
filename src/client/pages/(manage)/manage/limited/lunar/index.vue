<template>
  <UiContent :title="t('menuManageLimitedLunar')" :sub="t('menuManageLimitedLunarInfo')" class="max-w-3xl mx-auto">
    <template #more>
      <UButton color="gray" size="xs" class="ml-auto" @click="navigateTo('/manage/limited/lunar/history')">{{ t('history') }}</UButton>
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

      <template #bonus>
        <UCard>
          <UForm @submit="update" :state="state">
            <UFormGroup :label="t('manageLimitedLunarBonusTime')">
              <UiFlex class="gap-1">
                <SelectDate time v-model="state.bonus.start" :placeholder="t('start')" class="grow" />
                <SelectDate time v-model="state.bonus.end" :placeholder="t('end')" class="grow" />
              </UiFlex>
            </UFormGroup>

            <UFormGroup :label="t('manageLimitedLunarBonusValue')">
              <UInput v-model="state.bonus.value" type="number" />
            </UFormGroup>

            <UiFlex justify="between" class="mb-4">
							<UiText weight="semibold" size="sm">{{ t('limitedLunarJar') }}</UiText>
							<UToggle v-model="state.bonus.enable.jar" />
						</UiFlex>

            <UiFlex justify="between" class="mb-4">
							<UiText weight="semibold" size="sm">{{ t('manageLimitedLunarEve') }}</UiText>
							<UToggle v-model="state.bonus.enable.eve" />
						</UiFlex>

            <UiFlex justify="between" class="mb-4">
							<UiText weight="semibold" size="sm">{{ t('limitedLunarRedbag') }}</UiText>
							<UToggle v-model="state.bonus.enable.redbag" />
						</UiFlex>

            <UiFlex justify="between" class="mb-4">
							<UiText weight="semibold" size="sm">{{ t('limitedLunarPiece') }}</UiText>
							<UToggle v-model="state.bonus.enable.piece" />
						</UiFlex>

            <UiFlex justify="between">
							<UiText weight="semibold" size="sm">{{ t('limitedLunarTop') }}</UiText>
							<UToggle v-model="state.bonus.enable.top" />
						</UiFlex>
          </UForm>
        </UCard>
      </template>

      <template #eve>
        <UCard>
          <UForm @submit="update" :state="state">
            <UFormGroup :label="t('manageLimitedLunarEveTime')">
              <SelectDate time v-model="state.eve.time" :placeholder="t('time')" class="grow" />
            </UFormGroup>

            <UFormGroup :label="t('manageLimitedLunarEveReward')">
              <SelectItemList  :types="['coin', 'wheel', 'game_item']" v-model="state.eve.gift" />
            </UFormGroup>
          </UForm>
        </UCard>
      </template>

      <template #jar>
        <UCard>
          <UForm @submit="update" :state="state">
            <UFormGroup :label="t('manageLimitedLunarJarNow')">
              <UInput v-model="state.jar.now" type="number" />
            </UFormGroup>

            <UFormGroup :label="t('manageLimitedLunarJarTarget')">
              <UInput v-model="state.jar.target" type="number" />
            </UFormGroup>

            <UFormGroup :label="t('manageLimitedLunarJarMin')">
              <UInput v-model="state.jar.min" type="number" />
            </UFormGroup>

            <UFormGroup label="Tổng tiền nạp tối thiều để nhận thưởng">
              <UInput v-model="state.jar.payreward" type="number" />
            </UFormGroup>

						<UFormGroup :label="t('manageLimitedLunarJarShare')">
              <UInput v-model="state.jar.share" type="number" />
            </UFormGroup>

            <UFormGroup :label="t('manageLimitedLunarJarReward')">
              <SelectItemListStep v-model="state.jar.reward" />
            </UFormGroup>
          </UForm>
        </UCard>
      </template>

      <template #top>
        <UCard>
          <UForm @submit="update" :state="state">
            <UFormGroup :label="t('manageLimitedLunarTopNeed')">
              <UInput v-model="state.top.need" type="number" />
            </UFormGroup>

            <UFormGroup :label="t('manageLimitedLunarTopMaxRank')">
              <UInput v-model="state.top.max" type="number" />
            </UFormGroup>

            <UFormGroup :label="t('manageLimitedLunarTopReward')" v-if="state.top.reward">
              <SelectItemListRank v-model="state.top.reward" />
            </UFormGroup>
          </UForm>
        </UCard>
      </template>

      <template #redbag>
        <UCard>
          <UForm @submit="update" :state="state">
            <UFormGroup :label="t('manageLimitedLunarRedbagShare')">
              <UInput v-model="state.redbag.share" type="number" />
            </UFormGroup>

            <UFormGroup :label="t('manageLimitedLunarRedbagDay')">
              <UInput v-model="state.redbag.day" type="number" />
            </UFormGroup>

						<UFormGroup :label="t('manageLimitedLunarRedbagPiece')">
              <UInput v-model="state.redbag.piece" type="number" />
            </UFormGroup>

            <UFormGroup :label="t('manageLimitedLunarRedbagReward')">
              <SelectItemListRate :types="['coin', 'wheel', 'game_item']" v-model="state.redbag.random" />
            </UFormGroup>

            <UFormGroup :label="t('manageLimitedLunarRedbagStepReward')">
              <SelectItemListValue v-model="state.redbag.reward" />
            </UFormGroup>
          </UForm>
        </UCard>
      </template>

      <template #piece>
        <UCard>
          <UForm @submit="update" :state="state">
						<UFormGroup :label="t('manageLimitedLunarPiecePercentA')">
              <UInput v-model="state.piece.percent.A" type="number" />
            </UFormGroup>

            <UFormGroup :label="t('manageLimitedLunarPiecePercentB')">
              <UInput v-model="state.piece.percent.B" type="number" />
            </UFormGroup>

            <UFormGroup :label="t('manageLimitedLunarPiecePercentC')">
              <UInput v-model="state.piece.percent.C" type="number" />
            </UFormGroup>

            <UFormGroup :label="t('manageLimitedLunarPiecePercentD')">
              <UInput v-model="state.piece.percent.D" type="number" />
            </UFormGroup>

            <UFormGroup :label="t('manageLimitedLunarPieceReward')">
              <ManageLimitedLunarPieceSelect v-model="state.piece.reward" :types="['coin', 'wheel', 'game_item']" />
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
           {{ t('manageLimitedLunarResetInfo') }}
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
  { label: t('manageLimitedLunarBonus'), slot: 'bonus' },
  { label: t('limitedLunarJar'), slot: 'jar' },
  { label: t('manageLimitedLunarEve'), slot: 'eve' },
  { label: t('limitedLunarRedbag'), slot: 'redbag' },
	{ label: t('limitedLunarPiece'), slot: 'piece' },
	{ label: t('limitedLunarTop'), slot: 'top' },
])

const state = ref({
  time: {
		active: false,
		start: null,
		end: null,
	},
  eve: {
    time: null,
    gift: []
  },
  bonus: {
    start: null,
    end: null,
    value: 0,
    enable: {
      jar: false,
      eve: false,
      top: false,
      redbag: true,
      piece: false,
    }
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
	redbag: {
    day: 0,
		share: 0,
		piece: 0,
		random: [],
		reward: [],
	},
  piece: {
    percent: {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
    },
    reward: []
  }
})

const update = async () => {
  try {
    loading.value.update = true

    await useAPI('limited/lunar/manage/update', state.value)
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

    await useAPI('limited/lunar/manage/reset')
    getConfig()
    loading.value.update = false
		modal.value.reset = false
  }
  catch(e) {
    loading.value.update = false
  }
}

const getConfig = async () => {
  const config = await useAPI('limited/lunar/manage/get')
  state.value = Object.assign(state.value, config)
}

getConfig()
</script>