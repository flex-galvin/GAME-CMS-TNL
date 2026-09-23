<template>
  <UModal v-model="modal" prevent-close :ui="{width: 'sm:max-w-[700px] max-w-[400px]'}">
    <DataLimitedMonster :show-close="true" @close="modal = false"/>
  </UModal>
</template>

<script setup>
const configStore = useConfigStore()
const modal = ref(false)

const eventModal = computed(() => configStore.eventLimited.monster.modal)
const eventData = computed(() => configStore.eventLimited.monster.data)
watch(() => eventModal.value, (val) => !!val && getData())
watch(modal, (val) => !val && configStore.setEventLimitedModal('monster', false))
// watch(eventData, (val) => !!val ? (modal.value = true) : (modal.value = false))

const getData = async () => {
  try {
    const data = await useAPI('limited/monster/public/get')
    if(!data) throw true
    
    configStore.setEventLimited('monster', data)
    modal.value = true
  }
  catch(e){
    configStore.removeEventLimited('monster')
    modal.value = false
  }
}
</script>