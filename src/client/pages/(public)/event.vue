<template>
  <div>
    <UModal v-model="modal" preventClose :ui="{ width: 'sm:max-w-[900px]' }">
      <UiContent :title="t('menuEvent')" :sub="t('menuEventInfo')" class="bg-card rounded-2xl p-4">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="navigateTo('/')"></UButton>
        </template>

        <MainEvent />
      </UiContent>
    </UModal>
  </div>
</template>

<script setup>
const { t } = useI18n()
const configStore = useConfigStore()
const modal = ref(true)

useSeoMeta({
  title: () => `${t('menuEvent')} - ${configStore.config.name}`,
  ogTitle: () => `${t('menuEvent')} - ${configStore.config.name}`,
  description: () => t('menuEventInfo'),
  ogDescription: () => t('menuEventInfo')
})

onMounted(() => (modal.value = true))
</script>