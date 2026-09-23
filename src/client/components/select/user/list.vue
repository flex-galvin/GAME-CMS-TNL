<template>
  <UCard :ui="{ 
    header: { padding: 'p-2 sm:p-2' },
    body: { padding: 'p-2.5 sm:p-2.5' },
  }">
    <template #header>
      <UiFlex justify="end">
        <UButton color="gray" @click="modal.add = true">{{ t('add') }}</UButton>
      </UiFlex>
    </template>

    <UiFlex justify="center" v-if="list.length == 0">
      <UiText align="center" color="gray" size="sm" weight="semibold">{{ t('all') }}</UiText>
    </UiFlex>

    <UiFlex wrap class="gap-0.5" v-else>
      <UBadge class="cursor-pointer" color="gray" v-for="(i, index) in list" :key="i" @click="delAction(index)">
        <UiText>{{ i.username }}</UiText>
        <UiIcon name="i-bx-x" class="ml-0.5" size="4"/>
      </UBadge>
    </UiFlex>

    <!-- Modal Add -->
    <UModal v-model="modal.add" preventClose>
      <UForm @submit="addAction" class="bg-card rounded-2xl p-4">
        <UFormGroup :label="t('user')" name="user">
          <SelectUser v-model:user-data="stateAdd" />
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton color="yellow" type="submit">{{ t('add') }}</UButton>
          <UButton color="gray" @click="modal.add = false">{{ t('close') }}</UButton>
        </UiFlex>
      </UForm>
    </UModal>
  </UCard>
</template>

<script setup>
const { t } = useI18n()

const props = defineProps({
  modelValue: Array,
})
const emits = defineEmits(['update:modelValue'])

const list = ref(props.modelValue ? JSON.parse(JSON.stringify(props.modelValue)) : [])

const stateAdd = ref(undefined)

const modal = ref({
  add: false,
  user: false
})

watch(() => modal.value.add, (val) => {
  if(!val){
    stateAdd.value = undefined
  }
})


const addAction = () => {
  try {
    if(!stateAdd.value) throw t('errorSelectAllInput')

    const data = stateAdd.value
    const user = data._id

    const check = list.value.find(i => (i._id === user))
    if(!!check) throw t('errorUserExists')

    list.value.push(data)

    emits('update:modelValue', list.value)
    modal.value.add = false
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
</script>