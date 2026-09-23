<template>
  <UModal v-model="modal" prevent-close :ui="{width: 'sm:max-w-[600px] max-w-[400px]'}">
    <DataLimitedPay :show-close="true" @close="modal = false"/>
  </UModal>
</template>

<script setup>
const configStore = useConfigStore()
const modal = ref(false)

const eventModal = computed(() => configStore.eventLimited.pay.modal)
const eventData = computed(() => configStore.eventLimited.pay.data)
watch(() => eventModal.value, (val) => !!val && getData())
watch(modal, (val) => !val && configStore.setEventLimitedModal('pay', false))
// watch(eventData, (val) => !!val ? (modal.value = true) : (modal.value = false))

const getData = async () => {
  try {
    const data = await useAPI('limited/pay/public/get')
    if(!data) throw true
    
    configStore.setEventLimited('pay', data)
    modal.value = true
  }
  catch(e){
    configStore.removeEventLimited('pay')
    modal.value = false
  }
}
</script>