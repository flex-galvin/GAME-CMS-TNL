<template>
  <header class=" 
    w-full min-w-0 max-w-full
    flex items-center
    py-2
    md:gap-1 gap-0.5
  ">
    <NuxtLink to="/" class="min-w-0 flex-1">
      <UiLogo/>
    </NuxtLink>

    <UiFlex class="ml-auto min-w-0 max-w-[50%] shrink-0 gap-1">
      <LazyAuthHeader v-if="!!authStore.isLogin" />
    </UiFlex>
  </header>
</template>

<script setup>
const authStore = useAuthStore()
</script>
