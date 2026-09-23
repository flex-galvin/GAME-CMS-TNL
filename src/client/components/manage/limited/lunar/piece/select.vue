<template>
  <div>
    <UiFlex justify="end" class="mb-2">
      <UButton color="gray" @click="modal.add = true">{{ t('add') }}</UButton>
    </UiFlex>

    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <UTable :columns="columns" :rows="list">
        <template #pieces-data="{ row }">
          <UiFlex class="gap-0.5">
            <UBadge v-for="item in row.pieces" color="primary" :key="item" variant="soft">{{ item }}</UBadge>
          </UiFlex>
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
        <UFormGroup :label="t('piece')">
          <USelectMenu v-model="stateAdd.pieces" :options="['A','B','C','D']" multiple size="lg">
            <template #label>
              <template v-if="stateAdd.pieces.length > 0">
                <UBadge v-for="item in stateAdd.pieces" color="primary" :key="item" variant="soft">{{ item }}</UBadge>
              </template>
              <template v-else>{{ t('manageLimitedLunarPieceSelect') }}</template>
            </template>

            <template #option="{ option }">{{ t('piece') }} {{ option }}</template>
          </USelectMenu>
        </UFormGroup>

        <UFormGroup :label="t('award')">
          <SelectItemList v-model="stateAdd.gift" :types="props.types || ['coin', 'wheel', 'game_item']" />
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
        <UFormGroup :label="t('piece')">
          <USelectMenu v-model="stateEdit.pieces" :options="['A','B','C','D']" multiple size="lg" disabled>
            <template #label>
              <template v-if="stateEdit.pieces.length > 0">
                <UBadge v-for="item in stateEdit.pieces" color="primary" :key="item" variant="soft">{{ item }}</UBadge>
              </template>
              <template v-else>{{ t('manageLimitedLunarPieceSelect') }}</template>
            </template>

            <template #option="{ option }">{{ t('piece') }} {{ option }}</template>
          </USelectMenu>
        </UFormGroup>

        <UFormGroup :label="t('award')">
          <SelectItemList  v-model="stateEdit.gift" :types="props.types || ['coin', 'wheel', 'game_item']" />
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

const props = defineProps(['modelValue', 'types'])
const emits = defineEmits(['update:modelValue'])
const list = ref([])

const columns = [
  {
    key: 'pieces',
    label: t('piece'),
  },{
    key: 'gift',
    label:  t('award'),
  },{
    key: 'actions',
    label:  t('action'),
  }
]

const stateAdd = ref({
  pieces: [],
  gift: []
})

const stateEdit = ref({
  index: null,
  pieces: null,
  gift: null
})

const modal = ref({
  add: false,
  edit: false
})

watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
  pieces: [],
  gift: []
}))

const openEdit = (row, index) => {
  stateEdit.value.index = index
  stateEdit.value.pieces = JSON.parse(JSON.stringify(row.pieces))
  stateEdit.value.gift = JSON.parse(JSON.stringify(row.gift))
  modal.value.edit = true
}

const sameArray = (a, b) => {
  if (a.length !== b.length) return false
  const aSorted = [...a].sort()
  const bSorted = [...b].sort()
  return aSorted.every((v, i) => v === bSorted[i])
}

const addAction = () => {
  try {
    if(stateAdd.value.pieces.length == 0) throw t('manageLimitedLunarPieceSelectErrorNoItem')
    if(stateAdd.value.gift.length == 0) throw t('errorNoAward')

    const data = stateAdd.value
    const check = list.value.find(i => sameArray(i.pieces, stateAdd.value.pieces))
    if(!!check) throw t('manageLimitedLunarPieceSelectErrorExists')
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
    if(stateEdit.value.pieces.length == 0) throw t('manageLimitedLunarPieceSelectErrorNoItem')
    if(stateEdit.value.gift.length == 0) throw t('errorNoAward')
    if(!list.value[stateEdit.value.index]) throw t('errorObjectNotFound')

    const data = stateEdit.value
    list.value[stateEdit.value.index].pieces = data.pieces
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