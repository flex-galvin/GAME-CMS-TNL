<template>
  <div :class="{ 'HideScroll max-h-[45vh] overflow-y-auto p-0.5' : !!scroll }">
    <Transition name="page" mode="out-in">
      <DataEmpty v-if="!!loading || list.length == 0" :loading="loading" class="min-h-[300px]"></DataEmpty>
      
      <div class="@container grid grid-cols-12 gap-2 overflow-hidden" v-else>
        <UiEffectOb v-for="(row, index) in list" :key="index" class="@4xl:col-span-3 @xl:col-span-4 col-span-6 cursor-pointer">
          <UCard @click="openReceive(row)" >
            <UiFlex type="col">
              <UiText mini weight="semibold" class="text-sm md:text-lg text-gradient line-clamp-1 max-w-[90%]">
                {{ row.name }}
              </UiText>

              <div class="my-6 w-full">
                <UiFlex justify="between" class="w-full mb-1">
                  <UiIcon name="i-material-symbols-light-line-start-circle-rounded" size="5" color="gray" />
                  <UiText mini size="sm" color="green" weight="semibold">{{ useDayJs().displayTime(row.start) }}</UiText>
                </UiFlex>

                <UiFlex justify="between" class="w-full">
                  <UiIcon name="i-material-symbols-light-line-end-circle-rounded" size="5" color="gray" />
                  <UiText mini size="sm" color="rose" weight="semibold">{{ useDayJs().displayTime(row.end) }}</UiText>
                </UiFlex>
              </div>

              <UButton color="gray" class="px-4 md:px-6 max-w-full">{{ t('more') }}</UButton>
            </UiFlex>
          </UCard>
        </UiEffectOb>
      </div>
    </Transition>

    <UModal v-model="modal" prevent-close :ui="{width: 'sm:max-w-[700px]'}">
      <UiContent :title="stateSelect.name" :sub="t('detailedInformation')" class="bg-card rounded-2xl p-4">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal = false"></UButton>
        </template>

        <UiFlex>
          <UTabs v-model="tab" :items="tabItems"></UTabs>
        </UiFlex>

        <div v-if="!!stateSelect">
          <DataEventPowerView v-if="tab == 0" :fetch-id="stateSelect._id" />
          <DataEventPowerAward v-if="tab == 1" :event="stateSelect" />
        </div>
      </UiContent>
    </UModal>
  </div>
</template>

<script setup>
const { t } = useI18n()

const props = defineProps({
  scroll: Boolean
})
const authStore = useAuthStore()
watch(() => authStore.isLogin, () => getList())

const loading = ref(true)
const modal = ref(false)
const list = ref([])

const tab = ref(0) 
const tabItems = [
  { label: t('rank') },
  { label: t('award') },
]

const stateSelect = ref(null)

const openReceive = (row) => {
  stateSelect.value = row
  modal.value = true
}

const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI('event/public/power/list')

    list.value = data
    setTimeout(() => loading.value = false)
  }
  catch(e){
    list.value = []
    setTimeout(() => loading.value = false)
  }
}

getList()
</script>