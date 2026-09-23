<template>
  <UModal v-model="modal" prevent-close :ui="{width: 'sm:max-w-[700px] max-w-[400px]'}">
    <DataLimitedHalloween :show-close="true" @close="modal = false"/>
  </UModal>
</template>

<script setup>
const configStore = useConfigStore()
const modal = ref(false)

const eventModal = computed(() => configStore.eventLimited.halloween.modal)
const eventData = computed(() => configStore.eventLimited.halloween.data)
watch(() => eventModal.value, (val) => !!val && getData())
watch(modal, (val) => !val && configStore.setEventLimitedModal('halloween', false))
// watch(eventData, (val) => !!val ? (modal.value = true) : (modal.value = false))

const getData = async () => {
  try {
    const data = await useAPI('limited/halloween/public/get')
    if(!data) throw true
    
    configStore.setEventLimited('halloween', data)
    modal.value = true
  }
  catch(e){
    configStore.removeEventLimited('halloween')
    modal.value = false
  }
}
</script>