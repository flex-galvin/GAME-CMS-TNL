<template>
  <UModal v-model="modal">
    <UiContent :title="configStore.config?.name" :sub="configStore.config?.description" class="bg-card rounded-2xl p-6">
      <template #more>
        <UButton icon="i-bx-x" class="ml-auto" size="xs" color="gray" square @click="modal = false"></UButton>
      </template>

      <LazyAuthSignIn v-if="tabItem == 0" @up="tabItem = 1" @done="doneIn"></LazyAuthSignIn>
      <LazyAuthSignUp v-if="tabItem == 1" @in="tabItem = 0" @done="doneUp"></LazyAuthSignUp>   
    </UiContent>
  </UModal>
</template>

<script setup>
const { t } = useI18n()
const authStore = useAuthStore()
const configStore = useConfigStore()
const modal = ref(false)
const tabItem = ref(authStore.tab || 0) 

watch(() => authStore.modal, (val) => !!val && (modal.value = true))
watch(() => authStore.tab, (val) => tabItem.value = val)
watch(modal, (val) => !val && authStore.setModal(false))

const doneIn = async () => {
  modal.value = false
  await nextTick()
  await authStore.setAuth()
}

const doneUp = async () => {
  modal.value = false
  await nextTick()
  await authStore.setAuth()
  useTo().navigateToSSL('/thankyou')
}
</script>