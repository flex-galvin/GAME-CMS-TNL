<template>
  <Transition name="page" mode="out-in">
    <DataEmpty :loading="loading.load" class="min-h-[300px]" v-if="!!loading.load || list.length == 0"></DataEmpty>

    <div v-else>
      <UCard :ui="{ body: { padding: 'p-0 sm:p-0' } }" >
        <UTable :columns="columns" :rows="list" v-model:sort="sort">
          <template #need-data="{ row }">
            <UiText weight="semibold">{{ useMoney().miniMoney(row.need) }}</UiText>
          </template>

          <template #gift-data="{ row }">
            <DataItemListMini :items="row.gift" :max="2" class="md:hidden"/>
            <DataItemList :items="row.gift" class="max-md:hidden" />
          </template>

          <template #actions-data="{ row }">
            <UiFlex justify="center">
              <UButton color="green" size="xs" @click="openReceive(row)">{{ t('receive') }}</UButton>
            </UiFlex>
          </template>
        </UTable>
      </UCard>

      <UModal v-model="modal.receive" preventClose>
        <UiContent :title="t('receiveReward')" :sub="t('receiveRewardSub')" class="bg-card rounded-2xl p-4" v-if="!!select">
          <template #more>
            <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.receive = false"></UButton>
          </template>

          <UForm :validate="validate" :state="select" @submit="submit">
            <UFormGroup :label="`${type == 'level' ? t('level') : t('power')}`" name="need">
              <UInput :model-value="useMoney().toMoney(select.need)" readonly />
            </UFormGroup>

            <UFormGroup :label="t('server')" name="server">
              <SelectGameServer v-model="select.server" />
            </UFormGroup>

            <UFormGroup :label="t('role')" v-if="!!select.server" name="role">
              <SelectGameRole v-model="select.role" :server="select.server" />
            </UFormGroup>

            <UFormGroup :label="t('award')" name="gift">
              <div class="bg-card-box rounded-2xl p-4">
                <DataItemList :items="select.gift" class="justify-center"/>
              </div>
            </UFormGroup>

            <UiFlex justify="end" class="gap-1">
              <UButton color="yellow" type="submit" :loading="loading.receive">{{ t('receive') }}</UButton>
              <UButton color="gray" @click="modal.receive = false" :disabled="!!loading.receive">{{ t('close') }}</UButton>
            </UiFlex>
          </UForm>
        </UiContent>
      </UModal>
    </div>
  </Transition>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps(['type', 'server'])

// List
const list = ref([])
const loading = ref({
  load: true,
  receive: false
})
const modal = ref({
  receive: false,
})

// Columns
const columns = computed(() => ([
  {
    key: 'need',
    label: props.type == 'level' ? t('level') : t('power')
  },{
    key: 'gift',
    label: t('award'),
  },{
    key: 'actions',
  }
]))

const select = ref({
  server: null,
  role: null,
  need: null
})

const validate = (state) => {
  const errors = []
  if (!state.server) errors.push({ path: 'server', message: t('errorSelectServer') })
  else if(state.server != props.server) errors.push({ path: 'server', message: t('errorServerNotSupport') })
  if (!state.role) errors.push({ path: 'role', message: t('errorSelectRole') })
  if (!state.gift || state.gift.length == 0) errors.push({ path: 'gift', message: t('errorEmptyAward') })
  return errors
}

const openReceive = (row) => {
  select.value = Object.assign(select.value, row)
  modal.value.receive = true
} 

const getList = async () => {
  try {
    loading.value.load = true
    const type = props.type
    const server = props.server
    const data = await useAPI('rank/public/mission/list', { type, server })

    list.value = data
    loading.value.load = false
  }
  catch (e) {
    loading.value.load = false
  } 
}

const submit = async () => {
  try {
    loading.value.receive = true
    const post = JSON.parse(JSON.stringify(select.value))
    delete post['gift']
    delete post['createdAt']
    delete post['updatedAt']
    await useAPI('rank/public/mission/receive', post)

    loading.value.receive = false
    modal.value.receive = false
  }
  catch (e) {
    loading.value.receive = false
  } 
}

watch(() => props.server, () => getList())
watch(() => props.type, () => getList())
onMounted(() => setTimeout(getList, 1))
</script>