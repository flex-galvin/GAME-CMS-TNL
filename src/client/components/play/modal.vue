<template>
  <UiContent :title="title" :sub="sub" class="bg-card rounded-2xl p-4">
    <template #more>
      <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="emits('close')"></UButton>
    </template>

    <slot></slot>
  </UiContent>
</template>

<script setup>
const props = defineProps(['title', 'sub'])
const emits = defineEmits(['close'])
</script>