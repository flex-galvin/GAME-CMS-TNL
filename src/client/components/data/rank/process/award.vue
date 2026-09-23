<template>
  <Transition name="page" mode="out-in">
    <DataEmpty :loading="loading" class="min-h-[300px]" v-if="!!loading || !process"></DataEmpty>

    <div v-else>
      <UiText align="center" color="gray" size="sm" class="px-8">
        {{ t('end') }} <span class="text-rose-400 font-semibold">{{ useDayJs().displayFull(process.end) }}</span> 
      </UiText>
      <UiText align="center" color="orange" size="xs" class="italic px-8">
        {{ t('systemAutomaticallyReturnsGifts') }}
      </UiText>

      <UCard class="mt-2" :ui="{ body: { padding: 'p-0 sm:p-0' } }" >
        <UTable :columns="columns" :rows="process.award">
          <template #rank-data="{ row }">
            <UBadge color="gray" variant="soft">{{ row.rank }}</UBadge>
          </template>

          <template #gift-data="{ row }">
            <DataItemListMini :items="row.gift" :max="3" class="md:hidden"/>
            <DataItemList :items="row.gift" class="max-md:hidden" />
          </template>
        </UTable>
      </UCard>
    </div>
  </Transition>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps(['type', 'server'])
const loading = ref(true)

// List
const process = ref(null)

// Columns
const columns = [
  {
    key: 'rank',
    label: t('rank')
  },{
    key: 'gift',
    label: t('award'),
  }
]

const getProcess = async () => {
  try {
    loading.value = true
    const type = props.type
    const server = props.server
    const data = await useAPI('rank/public/process/get', { type, server })

    process.value = data
    loading.value = false
  }
  catch (e) {
    loading.value = false
  } 
}

watch(() => props.server, () => getProcess())
watch(() => props.type, () => getProcess())
onMounted(() => setTimeout(getProcess, 1))
</script>