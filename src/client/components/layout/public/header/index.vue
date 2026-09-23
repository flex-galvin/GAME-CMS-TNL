<template>
  <header class=" 
    w-full
    flex items-start
    p-4
    md:gap-1 gap-0.5
  ">
    <NuxtLink to="/" class="-mt-4">
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