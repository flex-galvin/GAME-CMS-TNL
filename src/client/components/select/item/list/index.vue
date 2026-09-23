<template>
  <UCard :ui="{ body: { padding: 'p-0 sm:p-0' }, header: { padding: 'p-2 sm:p-2' } }">
    <template #header>
      <UiFlex justify="between">
        <SelectItemBox @change="mergeGift" class="min-w-[180px] mr-2" />
        <UButton color="gray" @click="modal.add = true">{{ t('add') }}</UButton>
      </UiFlex>
    </template>

    <UTable :columns="columns" :rows="list">
      <template #image-data="{ row }">
        <DataItemImage :src="row.item.item_image" :type="row.item.type" />
      </template>

      <template #name-data="{ row }">
        {{ row.item.item_name }}
      </template>

      <template #amount-data="{ row }">
        <UiText weight="semibold">{{ useMoney().toMoney(row.amount) }}</UiText>
      </template>

      <template #actions-data="{ row, index }">
        <UButton icon="i-bx-edit-alt" variant="link" class="mr-1" @click="openEdit(row, index)" />
        <UButton icon="i-bx-trash" color="red" variant="link" @click="delAction(index)" />
      </template>
    </UTable>

    <!-- Modal Add -->
    <UModal v-model="modal.add" preventClose>
      <UForm @submit="addAction" class="bg-card rounded-2xl p-4">
        <UFormGroup :label="t('item')">
          <SelectItem v-model="stateAdd._id" v-model:itemData="stateAdd.item" :types="types" />
        </UFormGroup>

        <UFormGroup :label="t('amount')">
          <UInput v-model="stateAdd.amount" type="number" />
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton color="yellow" type="submit">{{ t('add') }}</UButton>
          <UButton color="gray" @click="modal.add = false">{{ t('close') }}</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit -->
    <UModal v-model="modal.edit" preventClose>
      <UForm @submit="editAction" class="bg-card rounded-2xl p-4">
        <UFormGroup :label="t('item')">
          <UInput v-model="stateEdit.name" readonly />
        </UFormGroup>

        <UFormGroup :label="t('amount')">
          <UInput v-model="stateEdit.amount" type="number" />
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton color="yellow" type="submit">{{ t('edit') }}</UButton>
          <UButton color="gray" @click="modal.edit = false">{{ t('close') }}</UButton>
        </UiFlex>
      </UForm>
    </UModal>
  </UCard>
</template>

<script setup>
const { t } = useI18n()

const props = defineProps({
  modelValue: Array,
  types: { type: Array, default: () => [] }
})
const emits = defineEmits(['update:modelValue'])
const list = ref(props.modelValue || [])

const columns = [
  {
    key: 'image',
    label: t('item'),
  },{
    key: 'name',
    label: t('name'),
  },{
    key: 'amount',
    label: t('amount'),
  },{
    key: 'actions',
    label: t('action'),
  }
]

const stateAdd = ref({
  _id: null,
  item: null,
  amount: 1
})

const stateEdit = ref({
  index: null,
  name: null,
  amount: null
})

const modal = ref({
  add: false,
  edit: false
})

watch(() => modal.value.add, (val) => !val && (stateAdd.value = {
  _id: null,
  item: null,
  amount: 1
}))

const openEdit = (row, index) => {
  stateEdit.value.index = index
  stateEdit.value.name = row.item.item_name
  stateEdit.value.amount = row.amount
  modal.value.edit = true
}

const mergeGift = (gift) => {
  if(!gift || gift.length == 0) return

  const giftFormat = JSON.parse(JSON.stringify(gift))
  const arr = list.value.concat(giftFormat)

  list.value = arr.reduce((a, c) => {
    const obj = a.find((obj) => obj.item._id === c.item._id)
    if(!obj) a.push(c)
    else obj.amount += c.amount
    return a
  }, [])

  emits('update:modelValue', list.value)
}

const addAction = () => {
  try {
    if(!stateAdd.value._id || !stateAdd.value.item || !stateAdd.value.amount) throw t('errorInputEmpty')
    if(stateAdd.value.amount < 1) throw t('errorAmountGreateThanZero')

    const data = stateAdd.value
    const item = data.item

    const check = list.value.find(i => i.item._id === item._id)
    if(!!check) throw t('errorItemExists')

    delete data['_id']
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
    if(!stateEdit.value.amount) throw t('errorInputEmpty')
    if(stateEdit.value.amount < 1) throw t('errorAmountGreateThanZero')
    if(!list.value[stateEdit.value.index]) throw t('errorObjectNotFound')

    list.value[stateEdit.value.index].amount = stateEdit.value.amount

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

onMounted(() => {
  setTimeout(() => {
    list.value = props.modelValue
  }, 100)
})
</script>