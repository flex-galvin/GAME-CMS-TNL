<template>
  <div
    ref="boxRef"
    class="transition-all duration-700 ease-out origin-center"
    :style="{
      transform: isVisible ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(50px)',
      opacity: isVisible ? 1 : 0
    }"
  >
    <slot :visible="isVisible"></slot>
  </div>
</template>

<script setup>
import { useIntersectionObserver } from '@vueuse/core'
const emits = defineEmits(['visible'])
const boxRef = ref(null)
const isVisible = ref(false)

useIntersectionObserver(
  boxRef,
  ([entry]) => {
    isVisible.value = entry.isIntersecting
  },
  {
    threshold: 0.1
  }
)

watch(isVisible, (val) => !!val && emits('visible'))
</script>