<template>
  <div>
    <UiText align="center" color="gray" size="sm px-8">
      {{ t('fromDate') }} <span class="text-green-400 font-semibold">{{ useDayJs().displayFull(event.start) }} </span> 
      {{ t('toDate') }} <span class="text-rose-400 font-semibold">{{ useDayJs().displayFull(event.end) }} </span> 
    </UiText>

    <UiText align="center" color="orange" size="xs" class="italic px-8 mb-2">
      {{ t('systemAutomaticallyReturnsGifts') }}
    </UiText>

    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <UTable :columns="columns" :rows="list" v-model:sort="sort">
        <template #rank-data="{ row }">
          <UBadge color="gray" variant="soft">{{ t('rank') }} {{ row.rank }}</UBadge>
        </template>

        <template #gift-data="{ row }">
          <DataItemListMini size="md" :items="row.gift" :max="3" class="md:hidden"/>
          <DataItemList :items="row.gift" class="max-md:hidden" />
        </template>
      </UTable>
    </UCard>
  </div>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps(['event'])

// List
const list = ref(props.event.award)

// Columns
const columns = [
  {
    key: 'rank',
    label: t('rank'),
  },{
    key: 'gift',
    label: t('award'),
  }
]
</script>