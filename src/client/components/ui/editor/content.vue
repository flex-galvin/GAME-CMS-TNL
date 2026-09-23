<template>
  <div v-html="content" class="tiptap !p-0" :style="{ wordBreak: 'break-word' }"></div>
</template>

<script setup>
defineProps(['content'])
</script>