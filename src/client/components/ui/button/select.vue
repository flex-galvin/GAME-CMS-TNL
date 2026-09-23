<template>
  <UiFlex 
    justify="center" 
    class="
      bg-card-box 
      relative inline-flex cursor-pointer
      rounded-2xl
    "
    :class="{
      'bg-btn': !!active
    }"
  >
    <UiFlex justify="center z-[1] UiButtonSelect__Content">
      <slot></slot>
    </UiFlex>
  </UiFlex>
</template>

<script setup>
const props = defineProps({
  active: { type: Boolean, default: false }
})
</script>