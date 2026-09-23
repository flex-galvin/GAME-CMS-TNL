<template>
  <div>
    <UAlert 
      v-if="!!config && !!config.description" 
      color="primary"
      class="mb-2" 
      :title="t('description')"
      icon="i-fontisto-info"
      :description="config.description"
      :ui="{
        title: 'text-sm font-bold text-gradient',
        description: 'dark:text-gray-200',
        variant: {
          solid: 'bg-card-box backdrop-blur-2xl dark:text-white',
        },
        gap: 'gap-4',
        icon: {
          base: 'w-10 h-10'
        }
      }"
    ></UAlert>
    
    <UiFlex class="mb-2 gap-6">
      <DataEventTime :config="config" class="mr-auto" />

      <UiFlex class="gap-0.5">
        <UButton color="gray" :class="{ 'bg-btn' : view == 'list' }" icon="i-bx-list-ul" @click="view = 'list'"></UButton>
        <UButton color="gray" :class="{ 'bg-btn' : view == 'grid' }" icon="i-bxs-grid-alt" @click="view = 'grid'"></UButton>
      </UiFlex>
    </UiFlex>

    <div class="overflow-hidden" :class="{ 'HideScroll max-h-[45vh] overflow-y-auto p-0.5' : !!scroll }">
      <Transition name="page" mode="out-in">
        <DataEmpty v-if="!!loading || list.length == 0" :loading="loading" class="min-h-[300px]"></DataEmpty>
        
        <div v-else>
          <Transition name="page" mode="out-in">
            <div class="@container grid grid-cols-12 gap-2" v-if="view == 'grid'">
              <UiEffectOb v-for="(row, index) in list" :key="index" class="@4xl:col-span-3 @xl:col-span-4 col-span-6">
                <UCard>
                  <UiFlex type="col">
                    <UiText mini weight="semibold" class="text-sm md:text-lg line-clamp-1 mb-4 max-w-[90%]">
                      {{ toMoney(row.need) }}{{ t('moneyAcronym') }}
                    </UiText>

                    <DataItemListMini :max="2" :items="row.gift" justify="center" />

                    <UiText size="xs" weight="semibold" class="line-clamp-1 my-4" color="gray">{{ row.gift.length }} {{ t('item') }}</UiText>

                    <UButton :color="statusFormat[row.status].color" :disabled="row.status != 0" @click="openReceive(row)" :class="{'bg-btn': row.status == 0}" class="px-4 md:px-6 max-w-full">
                      {{ statusShow(row.status, row.need) }}
                    </UButton>
                  </UiFlex>
                </UCard>
              </UiEffectOb>
            </div>

            <UiFlex type="col" class="gap-2" v-else>
              <UiEffectOb v-for="(row, index) in list" :key="index" class="w-full rounded-2xl overflow-hidden">
                <UCard class="w-full">
                  <UiFlex class="gap-6 pt-[25px]">
                    <UiText 
                      color="gray" 
                      weight="bold"
                      class="
                        absolute top-0 left-0
                        px-4 py-2
                        bg-card-box
                        rounded-br-2xl
                        text-sm
                      "
                    >
                      <span class="text-gradient">{{ toMoney(row.need) }}{{ t('moneyAcronym') }}</span>
                    </UiText>

                    <DataItemList class="grow" :items="row.gift" />

                    <UButton 
                      :color="statusFormat[row.status].color" 
                      :disabled="row.status != 0" 
                      @click="openReceive(row)" 
                      class="
                        px-4 md:px-6 
                        !absolute right-0 top-0
                        rounded-tl-none rounded-br-none
                        text-[0.65rem] sm:text-xs md:text-sm
                      "
                      :class="{'bg-btn': row.status == 0}"
                    >
                      {{ statusShow(row.status, row.need) }}
                    </UButton>
                  </UiFlex>
                </UCard>
              </UiEffectOb>
            </UiFlex>
          </Transition>
        </div>
      </Transition>
    </div>

    <UModal v-model="modal.receive" prevent-close>
      <DataEventReceive :event="stateReceive" @done="doneReceive" @close="modal.receive = false" class="p-4" />
    </UModal>
  </div>
</template>

<script setup>
const { t } = useI18n()

const props = defineProps({
  scroll: Boolean
})
const authStore = useAuthStore()
const { toMoney, miniMoney } = useMoney()
watch(() => authStore.isLogin, () => getList())

const view = ref('list')
const loading = ref(true)
const modal = ref({ receive: false })

watch(() => modal.value.receive, (val) => !val && (stateReceive.value = null))

const config = ref({
  start: null,
  end: null,
  display: 0
})

const list = ref([])
const statistical = ref(undefined)

const type = ref('paymusty')
watch(() => type.value, () => getList())

const statusFormat = {
  '-3': { color: 'gray', label: t('error') },
  '-2': { color: 'gray', label: t('notLogin') },
  '-1': { color: 'gray', label: t('notYetNeed') },
  '0': { color: 'primary', label: t('receive') },
  '1': { color: 'gray', label: t('received') },
}

const statusShow = (number, need) => {
  if(number != -1 || !authStore.isLogin) return statusFormat[number].label
  const arrType = type.value.split('.')

  if(arrType.length > 1){
    let info = JSON.parse(JSON.stringify(statistical.value)) 
    arrType.forEach(i => {
      info =  info[i]
    })

    return view.value == 'list' ? `${toMoney(info)} / ${toMoney(need)}` : `${miniMoney(info)} / ${miniMoney(need)}`
  }
  else {
    return view.value == 'list' ? `${toMoney(statistical.value[type.value])} / ${toMoney(need)}` : `${miniMoney(statistical.value[type.value])} / ${miniMoney(need)}`
  }
}

// Receive
const stateReceive = ref(null)

const openReceive = (row) => {
  stateReceive.value = row
  modal.value.receive = true
}

const doneReceive = () => {
  modal.value.receive = false
  getList()
}

const getStatistical = async () => {
  try {
    if(!authStore.isLogin) throw true
    const data = await useAPI('user/public/statistical', { user: authStore.profile._id })
    statistical.value = data
  }
  catch(e){
    statistical.value = null
  }
}

const getList = async () => {
  try {
    loading.value = true
    getStatistical()
    const get = await useAPI('event/public/list', { type: type.value })

    list.value = get.list
    config.value = Object.assign(config.value, get.config)
    setTimeout(() => loading.value = false)
  }
  catch(e){
    list.value = []
    setTimeout(() => loading.value = false)
  }
}

getList()
</script>