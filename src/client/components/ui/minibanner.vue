<template>
  <UiFlex type="col" justify="center" class="MiniBanner rounded-2xl mb-4">
    <UiFlex class="gap-4 w-full">
      <UiImg 
        :src="!!type ? `/images/banner/${type}-min.png` : img" 
        class="
          bounce-anim 
          md:w-[80px] md:min-w-[80px] md:max-w-[80px]
          w-[70px] min-w-[70px] max-w-[70px]
          md:h-[80px] md:min-h-[80px] md:max-h-[80px]
          h-[70px] min-h-[70px] max-h-[70px]
        "
        w="1" h="1"
        v-if="!!type || !!img"
      />
      <div>
        <UiText weight="bold" class="text-xl md:text-3xl">{{ title }}</UiText>
        <UiText class="text-sm md:text-lg text-gray-300" v-if="!!sub">{{ sub }}</UiText>
        <slot name="sub"></slot>
      </div>
    </UiFlex>

    <slot></slot>
  </UiFlex>
</template>

<script setup>
const props = defineProps(['title', 'sub', 'type', 'img', 'show'])
</script>

<style lang="sass">
.MiniBanner
  position: relative
</style>