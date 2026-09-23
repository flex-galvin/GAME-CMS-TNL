<template>
  <UiEffectOb>
    <UiFlex class="gap-4">
      <img src="/images/icon/icon-sparks.svg" class="w-5" />
      <UiText class="text-gradient text-lg sm:text-xl md:text-2xl py-1.5 FTV uppercase z-[1]" style="letter-spacing: 1px;" weight="bold">{{ name }}</UiText>
    </UiFlex>
  </UiEffectOb>
</template>

<script setup>
const props = defineProps(['icon', 'name'])
</script>