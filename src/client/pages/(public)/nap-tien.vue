<template>
  <div>
    <div class="page-shell">
      <h1 id="page-heading">...</h1>
    </div>

    <UModal v-model="modal" preventClose :ui="{ width: 'sm:max-w-[700px]' }">
      <UiContent :title="t('menuPayment')" :sub="t('menuPaymentInfo')" class="bg-card rounded-2xl p-4">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="navigateTo('/')"></UButton>
        </template>

        <MainActionPayment />
      </UiContent>
    </UModal>
  </div>
</template>

<script setup>
const { t } = useI18n()
const configStore = useConfigStore()
const modal = ref(true)

useSeoMeta({
  title: () => `${t('menuPayment')} - ${configStore.config.name}`,
  ogTitle: () => `${t('menuPayment')} - ${configStore.config.name}`,
  description: () => t('menuPaymentInfo'),
  ogDescription: () => t('menuPaymentInfo'),
})

onMounted(() => (modal.value = true))
</script>