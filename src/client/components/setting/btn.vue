<template>
  <UiFlex class="inline-flex">
    <UButton icon="i-bx-cog" square size="lg" color="gray" @click="modal = true" />

    <UModal v-model="modal" :ui="{width: 'sm:max-w-[350px]'}">
      <Setting @close="modal = false" />
    </UModal>
  </UiFlex>
</template>

<script setup>
const modal = ref(false)
</script>