<template>
  <UModal v-model="modal" prevent-close :ui="{width: 'sm:max-w-[700px] max-w-[400px]'}">
    <DataLimitedLunar :show-close="true" @close="modal = false"/>
  </UModal>
</template>

<script setup>
const configStore = useConfigStore()
const modal = ref(false)

const eventModal = computed(() => configStore.eventLimited.lunar.modal)
const eventData = computed(() => configStore.eventLimited.lunar.data)
watch(() => eventModal.value, (val) => !!val && getData())
watch(modal, (val) => !val && configStore.setEventLimitedModal('lunar', false))
// watch(eventData, (val) => !!val ? (modal.value = true) : (modal.value = false))

const getData = async () => {
  try {
    const data = await useAPI('limited/lunar/public/get')
    if(!data) throw true
    
    configStore.setEventLimited('lunar', data)
    modal.value = true
  }
  catch(e){
    configStore.removeEventLimited('lunar')
    modal.value = false
  }
}
</script>