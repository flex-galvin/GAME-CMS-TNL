<template>
  <UCard :ui="{ body: { padding: 'p-0 sm:p-0' }, header: { padding: 'p-2 sm:p-2' } }">
    <template #header>
      <UiFlex justify="end">
        <UButton color="gray" @click="modal.add = true">{{ t('add') }}</UButton>
      </UiFlex>
    </template>

    <UTable :columns="columns" :rows="list">
      <template #user-data="{ row }">
        <UButton size="2xs" color="gray" @click="viewUser(row.user._id)">{{ row.user.username }}</UButton>
      </template>

      <template #server-data="{ row }">
        <UiText weight="semibold">{{ row.server.server_name }}</UiText>
      </template>

      <template #role-data="{ row }">
        <UiText weight="semibold">{{ row.role.role_name }}</UiText>
      </template>

      <template #actions-data="{ row, index }">
        <UButton icon="i-bx-trash" variant="link" color="red" @click="delAction(index)" />
      </template>
    </UTable>

    <!--Modal User Info-->
    <UModal v-model="modal.user" :ui="{width: 'sm:max-w-[900px]'}">
      <ManageUserInfo :user="stateUser" @close="modal.user = false" />
    </UModal>

    <!-- Modal Add -->
    <UModal v-model="modal.add" preventClose>
      <UForm @submit="addAction" class="bg-card rounded-2xl p-4">
        <UFormGroup :label="t('username')" name="user">
          <SelectUser v-model="state.user" v-model:user-data="stateAdd.user" />
        </UFormGroup>

        <UFormGroup :label="t('server')" name="server">
          <SelectGameServer v-model="state.server" v-model:server-data="stateAdd.server" />
        </UFormGroup>

        <UFormGroup :label="t('role')" name="role" v-if="!!state.server && !!state.user">
          <SelectGameRole v-model="state.role" v-model:role-data="stateAdd.role" :server="state.server" :user="state.user" />
        </UFormGroup>

        <UiFlex justify="end" class="mt-6">
          <UButton color="yellow" type="submit">{{ t('confirm') }}</UButton>
          <UButton color="gray" @click="modal.add = false" class="ml-1">{{ t('close') }}</UButton>
        </UiFlex>
      </UForm>
    </UModal>
  </UCard>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps({ modelValue: Array })
const emits = defineEmits(['update:modelValue'])

const list = ref(props.modelValue || [])

const columns = [
  {
    key: 'user',
    label: t('username'),
  },{
    key: 'server',
    label: t('server'),
  },{
    key: 'role',
    label: t('role'),
  },{
    key: 'actions',
    label: t('action'),
  }
]

const state = ref({
  user: null,
  server: null,
  role: null
})

const stateAdd = ref({
  user: null,
  server: null,
  role: null
})

const stateUser = ref(undefined)

const modal = ref({
  add: false,
  user: false
})

watch(() => modal.value.add, (val) => {
  if(!val){
    stateAdd.value = {
      user: null,
      server: null,
      role: null
    }
    state.value = {
      user: null,
      server: null,
      role: null
    }
  }
})

const viewUser = (_id) => {
  modal.value.user = true
  stateUser.value = _id
}

const addAction = () => {
  try {
    if(!stateAdd.value.user || !stateAdd.value.server || !stateAdd.value.role) throw t('errorSelectAllInput')

    const data = stateAdd.value
    const user = data.user._id
    const server = data.server.server_id
    const role = data.role.role_id

    const check = list.value.find(i => (i.user._id === user) && (i.server.server_id === server) && (i.role.role_id === role))
    if(!!check) throw t('errorRoleExists')

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