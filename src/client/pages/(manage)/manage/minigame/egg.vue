<template>
  <UiContent :title="t('menuManageMinigameEgg')" :sub="t('menuManageMinigameEggInfo')" class="max-w-3xl mx-auto">
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

      <template #one>
        <UCard>
          <UForm @submit="update" :state="state">
            <UFormGroup :label="t('price')">
              <UInput v-model="state.one.price" />
            </UFormGroup>

            <UFormGroup :label="t('award')">
              <SelectItemListRate  :types="['coin', 'wheel', 'game_item']" v-model="state.one.gift" />
            </UFormGroup>
          </UForm>
        </UCard>
      </template>

      <template #two>
        <UCard>
          <UForm @submit="update" :state="state">
            <UFormGroup :label="t('price')">
              <UInput v-model="state.two.price" />
            </UFormGroup>

            <UFormGroup :label="t('award')">
              <SelectItemListRate  :types="['coin', 'wheel', 'game_item']" v-model="state.two.gift" />
            </UFormGroup>
          </UForm>
        </UCard>
      </template>

      <template #three>
        <UCard>
          <UForm @submit="update" :state="state">
            <UFormGroup :label="t('price')">
              <UInput v-model="state.three.price" />
            </UFormGroup>

            <UFormGroup :label="t('award')">
              <SelectItemListRate  :types="['coin', 'wheel', 'game_item']" v-model="state.three.gift" />
            </UFormGroup>
          </UForm>
        </UCard>
      </template>

      <template #four>
        <UCard>
          <UForm @submit="update" :state="state">
            <UFormGroup :label="t('price')">
              <UInput v-model="state.four.price" />
            </UFormGroup>

            <UFormGroup :label="t('award')">
              <SelectItemListRate  :types="['coin', 'wheel', 'game_item']" v-model="state.four.gift" />
            </UFormGroup>
          </UForm>
        </UCard>
      </template>

      <template #five>
        <UCard>
          <UForm @submit="update" :state="state">
            <UFormGroup :label="t('price')">
              <UInput v-model="state.five.price" />
            </UFormGroup>

            <UFormGroup :label="t('award')">
              <SelectItemListRate  :types="['coin', 'wheel', 'game_item']" v-model="state.five.gift" />
            </UFormGroup>
          </UForm>
        </UCard>
      </template>

      <template #six>
        <UCard>
          <UForm @submit="update" :state="state">
            <UFormGroup :label="t('price')">
              <UInput v-model="state.six.price" />
            </UFormGroup>

            <UFormGroup :label="t('award')">
              <SelectItemListRate  :types="['coin', 'wheel', 'game_item']" v-model="state.six.gift" />
            </UFormGroup>
          </UForm>
        </UCard>
      </template>
    </UAccordion>

    <UiFlex justify="end" class="gap-1">
      <UButton color="yellow" @click="update" :loading="loading.update">{{ t('update') }}</UButton>
    </UiFlex>
  </UiContent>
</template>

<script setup>
const { t } = useI18n()

const loading = ref({
  load: true,
  update: false
})

const menu = computed(() => [
  { label: `${t('row')} 1`, slot: 'one' },
  { label: `${t('row')} 2`, slot: 'two' },
  { label: `${t('row')} 3`, slot: 'three' },
  { label: `${t('row')} 4`, slot: 'four' },
  { label: `${t('row')} 5`, slot: 'five' },
  { label: `${t('row')} 6`, slot: 'six' },
])

const state = ref({
  one: { price: null, gift: [] },
  two: { price: null, gift: [] },
  three: { price: null, gift: [] },
  four: { price: null, gift: [] },
  five: { price: null, gift: [] },
  six: { price: null, gift: [] },
})

const update = async () => {
  try {
    loading.value = true

    await useAPI('minigame/egg/manage/update', state.value)
    getConfig()
    loading.value = false
  }
  catch(e) {
    loading.value = false
  }
}

const getConfig = async () => {
  const config = await useAPI('minigame/egg/manage/get')
  state.value = Object.assign(state.value, config)
}

getConfig()
</script>