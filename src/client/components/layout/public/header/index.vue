<template>
  <header class=" 
    w-full max-w-full
    flex items-center
    py-2
    md:gap-1 gap-0.5
  ">
    <NuxtLink to="/">
      <UiLogo/>
    </NuxtLink>

    <UiFlex class="ml-auto gap-1">
      <LazyAuthHeader v-if="!!authStore.isLogin" />
    </UiFlex>
  </header>
</template>

<script setup>
const authStore = useAuthStore()
const route = useRoute()
</script>