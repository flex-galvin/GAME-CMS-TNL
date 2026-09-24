<template>
  <div>
    <UModal v-model="modal" preventClose :ui="{ width: 'sm:max-w-[400px]' }">
      <UiContent title="Khuyễn Mãi" sub="Các khuyến mãi hiện có của trò chơi" class="bg-card rounded-2xl p-4">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="navigateTo('/')"></UButton>
        </template>

        <DataPromoHome />
      </UiContent>
    </UModal>
  </div>
</template>

<script setup>
const { t } = useI18n()
const configStore = useConfigStore()
const modal = ref(true)

useSeoMeta({
  title: () => `Khuyến Mãi - ${configStore.config.name}`,
  ogTitle: () => `Khuyến Mãi - ${configStore.config.name}`,
  description: () => 'Các khuyến mãi hiện có của trò chơi',
  ogDescription: () => 'Các khuyến mãi hiện có của trò chơi',
})

onMounted(() => (modal.value = true))
</script>