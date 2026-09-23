<template>
  <div>
    <UiFlex justify="end" class="mb-2">
      <UButton color="gray" @click="modal.add = true">{{ t('add') }}</UButton>
    </UiFlex>

    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <UTable :columns="columns" :rows="list" v-model:sort="sort">
        <template #rank-data="{ row }">
          <UBadge color="gray" variant="soft">{{ t('rank') }} {{ row.rank }}</UBadge>
        </template>

        <template #gift-data="{ row }">
          <DataItemList :items="row.gift"  />
        </template>

        <template #actions-data="{ row, index }">
          <UButton icon="i-bx-edit-alt" variant="link" class="mr-1" @click="openEdit(row, index)" />
          <UButton icon="i-bx-trash" color="red" variant="link" @click="delAction(index)" />
        </template>
      </UTable>
    </UCard>

    <!-- Modal Add -->
    <UModal v-model="modal.add" preventClose :ui="{width: 'sm:max-w-[700px]'}">
      <UForm @submit="addAction" class="bg-card rounded-2xl p-4">
        <UFormGroup :label="t('rank')">
          <UInput v-model="stateAdd.rank" type="number" />
        </UFormGroup>

        <UFormGroup :label="t('award')">
          <SelectItemList v-model="stateAdd.gift" :types="['coin', 'wheel', 'game_item']" />
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton color="yellow" type="submit">{{ t('add') }}</UButton>
          <UButton color="gray" @click="modal.add = false">{{ t('close') }}</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit -->
    <UModal v-model="modal.edit" preventClose :ui="{width: 'sm:max-w-[700px]'}">
      <UForm @submit="editAction" class="bg-card rounded-2xl p-4">
        <UFormGroup :label="t('rank')">
          <UInput v-model="stateEdit.rank" type="number" readonly />
        </UFormGroup>

        <UFormGroup :label="t('award')">
          <SelectItemList  v-model="stateEdit.gift" :types="['coin', 'wheel', 'game_item']" />
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton color="yellow" type="submit">{{ t('edit') }}</UButton>
          <UButton color="gray" @click="modal.edit = false">{{ t('close') }}</UButton>
        </UiFlex>
      </UForm>
    </UModal>
  </div>
</template>

<script setup>
const { t } = useI18n()

const props = defineProps(['modelValue'])
const emits = defineEmits(['update:modelValue'])
const list = ref([])

const columns = [
  {
    key: 'rank',
    label: t('rank'),
  },{
    key: 'gift',
    label:  t('award'),
  },{
    key: 'actions',
    label:  t('action'),
  }
]

const sort = ref({
  column: 'rank',
  direction: 'asc'
})

const stateAdd = ref({
  rank: null,
  gift: []
})

const stateEdit = ref({
  index: null,
  rank: null,
  gift: null
})

const modal = ref({
  add: false,
  edit: false
})

watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
  rank: null,
  gift: []
}))

const openEdit = (row, index) => {
  stateEdit.value.index = index
  stateEdit.value.rank = row.rank
  stateEdit.value.gift = JSON.parse(JSON.stringify(row.gift))
  modal.value.edit = true
}

const addAction = () => {
  try {
    if(!stateAdd.value.rank) throw t('errorInputEmpty')
    if(stateAdd.value.gift.length == 0) throw t('errorNoAward')

    const data = stateAdd.value
    const check = list.value.find(i => i.rank == data.rank)
    if(!!check) throw t('errorRankExists')
    list.value.push(data)

    emits('update:modelValue', list.value)
    modal.value.add = false
  }
  catch (e) {
    useNotify().error(e.toString())
  }
}

const editAction = () => {
  try {
    if(!stateEdit.value.rank) throw t('errorInputEmpty')
    if(stateEdit.value.gift.length == 0) throw t('errorNoAward')
    if(!list.value[stateEdit.value.index]) throw t('errorObjectNotFound')

    const data = stateEdit.value
    list.value[stateEdit.value.index].rank = data.rank
    list.value[stateEdit.value.index].gift = data.gift

    emits('update:modelValue', list.value)
    modal.value.edit = false
  }
  catch (e) {
    useNotify().error(e.toString())
  }
}

const delAction = (index) => {
  try {
    if(!list.value[index]) throw t('errorObjectNotFound')
    list.value.splice(index, 1)

    emits('update:modelValue', list.value)
  }
  catch (e) {
    useNotify().error(e.toString())
  }
}

onMounted(() => setTimeout(() => (list.value = props.modelValue || []), 1))
</script>