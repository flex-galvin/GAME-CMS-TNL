<template>
  <div>
    <UModal v-model="modal" prevent-close :ui="{ width: 'sm:max-w-[400px]' }" @after-leave="openSelectedEvent">
      <UiContent title="Hạn Thời" sub="Các khuyến mãi và sự kiện có thời hạn" class="bg-card rounded-2xl p-4">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="navigateTo('/')"></UButton>
        </template>

        <DataLimitedBanner class="w-full mb-1" @select="selectEvent" />
        
        <DataPromoHome @click="navigateTo('/')" />
      </UiContent>
    </UModal>
  </div>
</template>


<script setup>
const { t } = useI18n()
const configStore = useConfigStore()
const modal = ref(true)
const selectedEvent = ref(null)

const selectEvent = (key) => {
  if (!modal.value) return
  selectedEvent.value = key
  modal.value = false
}

const openSelectedEvent = async () => {
  const key = selectedEvent.value
  if (!key) return
  selectedEvent.value = null

  // Release the promo dialog's iOS scroll lock before opening another dialog.
  await navigateTo('/')
  await nextTick()
  configStore.setEventLimitedModal(key, true)
}

useSeoMeta({
  title: () => `Hạn Thời - ${configStore.config.name}`,
  ogTitle: () => `Hạn Thời - ${configStore.config.name}`,
  description: () => 'Các khuyến mãi và sự kiện có thời hạn',
  ogDescription: () => 'Các khuyến mãi và sự kiện có thời hạn',
})

onMounted(() => (modal.value = true))
</script>
