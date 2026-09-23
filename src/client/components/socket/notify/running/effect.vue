<template>
  <UiFlex class="!inline-flex rounded-2xl bg-animate p-1 pr-2 overflow-hidden gap-1 text-xs sm:text-sm">
    <UAvatar size="xs" :class="{ 'bg-black' : !configStore.config.logo_image }" :src="configStore.config.logo_image" :alt="configStore.config.name"></UAvatar>
    <slot></slot>
  </UiFlex>
</template>

<script setup>
const props = defineProps(['data'])
const configStore = useConfigStore()
</script>