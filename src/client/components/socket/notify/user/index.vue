<template>
  <DataEmpty :text="t('errorAuthEmpty')" v-if="!authStore.isLogin" />

  <UiFlex class="overflow-hidden" type="col" v-else>
    <SocketNotifyUserList />
  </UiFlex>
</template>

<script setup>
const { t } = useI18n()
const authStore = useAuthStore()
</script>