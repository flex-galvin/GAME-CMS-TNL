<template>
  <div class="relative w-full h-full min-w-full min-h-full max-w-full max-h-full overflow-hidden">
    <slot></slot>
  </div>
</template>

<script setup>
const { t } = useI18n()

useSeoMeta({
  title: () => t('playing'),
  robots: 'none'
})

const authStore = useAuthStore()
watch(() => authStore.isLogin, (val) => !val && useTo().navigateToSSL('/'))
</script>