<template>
  <UModal v-model="modal" prevent-close>
    <UiContent icon="i-bxs-bell" :title="t('notice')" :sub="t('noticeFromAdmin')" class="bg-card rounded-2xl p-4">
      <template #more>
        <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal = false"></UButton>
      </template>

      <div class="bg-card-box p-4 rounded-2xl">
        <UiEditorContent v-html="notice" />
      </div>
    </UiContent>
  </UModal>
</template>

<script setup>
const { t } = useI18n()
const { $socket } = useNuxtApp()

const modal = ref(false)
const notice = ref(null)

onMounted(() => {
  $socket.on('notice-system', (data) => {
    notice.value = data
    modal.value = true
  })
})
</script>