<template>
  <UModal v-model="modal" prevent-close :ui="{width: 'sm:max-w-[700px] max-w-[400px]'}">
    <DataLimitedChristmas :show-close="true" @close="modal = false"/>
  </UModal>
</template>

<script setup>
const configStore = useConfigStore()
const modal = ref(false)

const eventModal = computed(() => configStore.eventLimited.christmas.modal)
const eventData = computed(() => configStore.eventLimited.christmas.data)
watch(() => eventModal.value, (val) => !!val && getData())
watch(modal, (val) => !val && configStore.setEventLimitedModal('christmas', false))
// watch(eventData, (val) => !!val ? (modal.value = true) : (modal.value = false))

const getData = async () => {
  try {
    const data = await useAPI('limited/christmas/public/get')
    if(!data) throw true
    
    configStore.setEventLimited('christmas', data)
    modal.value = true
  }
  catch(e){
    configStore.removeEventLimited('christmas')
    modal.value = false
  }
}
</script>