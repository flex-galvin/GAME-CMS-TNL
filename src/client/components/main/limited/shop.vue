<template>
  <UModal v-model="modal" prevent-close :ui="{width: 'sm:max-w-[400px] max-w-[400px]'}">
    <DataLimitedShop :show-close="true" @close="modal = false"/>
  </UModal>
</template>

<script setup>
const configStore = useConfigStore()
const modal = ref(false)

const eventModal = computed(() => configStore.eventLimited.shop.modal)
const eventData = computed(() => configStore.eventLimited.shop.data)
watch(() => eventModal.value, (val) => !!val && getList())
watch(modal, (val) => !val && configStore.setEventLimitedModal('shop', false))
// watch(eventData, (val) => !!val ? (modal.value = true) : (modal.value = false))

const getList = async () => {
  try {
    const data = await useAPI('limited/shop/public/list')
    if(!data) throw true
    if(data.length == 0) throw true

    configStore.setEventLimited('shop', data)
    modal.value = true
  }
  catch(e){
    configStore.removeEventLimited('shop')
    modal.value = false
  }
}
</script>