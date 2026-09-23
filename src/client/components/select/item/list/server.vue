<template>
  <div>
    <UiFlex justify="end" class="mb-2">
      <UButton color="gray" @click="modal.add = true">{{ t('add') }}</UButton>
    </UiFlex>

    <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }">
      <UTable :columns="columns" :rows="list">
        <template #servers-data="{ row }">
          <UiFlex class="gap-0.5" wrap>
            <UBadge v-for="item in row.servers" color="gray" :key="item" variant="soft">{{ item }}</UBadge>
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
        <UFormGroup :label="t('server')">
          <SelectGameServers v-model="stateAdd.servers" size="lg" />
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
        <UFormGroup :label="t('server')">
          <SelectGameServers v-model="stateEdit.servers" />
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
    key: 'servers',
    label: t('server'),
  },{
    key: 'gift',
    label:  t('award'),
  },{
    key: 'actions',
    label:  t('action'),
  }
]

const stateAdd = ref({
  servers: [],
  gift: []
})

const stateEdit = ref({
  index: null,
  servers: null,
  gift: null
})

const modal = ref({
  add: false,
  edit: false
})

watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
  servers: [],
  gift: []
}))

const openEdit = (row, index) => {
  stateEdit.value.index = index
  stateEdit.value.servers = JSON.parse(JSON.stringify(row.servers))
  stateEdit.value.gift = JSON.parse(JSON.stringify(row.gift))
  modal.value.edit = true
}

const sameArray = (a, b) => {
  if (a.length !== b.length) return false
  const aSorted = [...a].sort()
  const bSorted = [...b].sort()
  return aSorted.every((v, i) => v === bSorted[i])
}

const canInsert = (list, newObj) => {
  const existing = new Set();
  for (const item of list) {
    for (const s of item.servers) {
      existing.add(s);
    }
  }

  const duplicates = [];
  for (const s of newObj.servers) {
    if (existing.has(s)) {
      duplicates.push(s);
    }
  }

  return duplicates;
}

const addAction = () => {
  try {
    if(stateAdd.value.servers.length == 0) throw t('selectServersEmpty')
    if(stateAdd.value.gift.length == 0) throw t('errorNoAward')

    const data = stateAdd.value
    const check = list.value.find(i => sameArray(i.servers, stateAdd.value.servers))
    if(!!check) throw 'Mảng máy chủ đã tồn tại'

    const check2 = canInsert(list.value, data)
    if(check2.length) throw `Các máy chủ (${check2.join('|')}) đã tồn tại trong bộ quà khác`
    
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
    if(stateEdit.value.servers.length == 0) throw t('selectServersEmpty')
    if(stateEdit.value.gift.length == 0) throw t('errorNoAward')
    if(!list.value[stateEdit.value.index]) throw t('errorObjectNotFound')

    const data = stateEdit.value
    list.value[stateEdit.value.index].servers = data.servers
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