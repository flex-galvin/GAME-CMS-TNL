<template>
  <header class=" 
    w-full
    flex items-center
    py-2
    md:gap-1 gap-0.5
  ">
    <NuxtLink to="/">
      <UiLogo/>
    </NuxtLink>

    <UiFlex class="ml-auto gap-1" v-if="!!authStore.isLogin">
      <LazyAuthHeader  />
    </UiFlex>
  </header>
</template>

<script setup>
const authStore = useAuthStore()
const route = useRoute()
</script>