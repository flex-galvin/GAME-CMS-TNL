<template>
  <UModal v-model="modal" prevent-close :ui="{width: 'sm:max-w-[450px]'}">
    <DataLimitedLootchest :show-close="true" @close="modal = false"/>
  </UModal>
</template>

<script setup>
const configStore = useConfigStore()
const modal = ref(false)

const eventModal = computed(() => configStore.eventLimited.lootchest.modal)
const eventData = computed(() => configStore.eventLimited.lootchest.data)
watch(() => eventModal.value, (val) => !!val && getData())
watch(modal, (val) => !val && configStore.setEventLimitedModal('lootchest', false))
// watch(eventData, (val) => !!val ? (modal.value = true) : (modal.value = false))

const getData = async () => {
  try {
    const data = await useAPI('limited/lootchest/public/get')
    if(!data) throw true
    
    configStore.setEventLimited('lootchest', data)
    modal.value = true
  }
  catch(e){
    configStore.removeEventLimited('lootchest')
    modal.value = false
  }
}
</script>