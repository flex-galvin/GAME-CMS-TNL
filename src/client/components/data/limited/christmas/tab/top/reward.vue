<template>
  <UiContent :title="t('limitedChristmasTopAward')" :sub="t('limitedChristmasTopAwardSub')" class="Christmas rounded-2xl p-4">
    <UiIcon name="i-bx-x" size="8" class="christmas-text absolute top-2 right-2 cursor-pointer z-1" @click="emits('close')" />

    <div class="bg-card-box rounded-2xl">
      <UTable :columns="columns" :rows="list">
        <template #rank-data="{ row }">
          <UiText class="FTV text-gradient">{{ row.rank }}</UiText>
        </template>

        <template #gift-data="{ row }">
          <DataItemListMini :items="row.gift" :max="3" />
        </template>
      </UTable>
    </div>
  </UiContent>
</template>

<script setup>
const { t } = useI18n()
const emits = defineEmits(['close'])

const configStore = useConfigStore()
const eventData = computed(() => configStore.eventLimited.christmas.data)
const list = computed(() => eventData.value.top.reward)

const columns = [
  { key: 'rank', label: t('rank') },
  { key: 'gift', label: t('award') }
]
</script>