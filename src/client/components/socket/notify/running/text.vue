<template>
  <div ref="container" class="relative inline-block w-auto overflow-hidden white-space-nowrap">
    <div
      ref="text"
      class="relative inline-block whitespace-nowrap will-change-transform font-semibold"
      :class="{ 
        'TextRunning': running 
      }"
      :style="{ 
        'animationDuration': `${duration}s`,
        '--end-text-pos': endtPos
      }"
      @animationend="onAnimationEnd"
      v-html="message"
    >
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  message: String
})
const emits = defineEmits(['end'])

const container = ref()
const text = ref()
const running = ref(false)
const duration = ref(0)
const endtPos = ref(0)

const onAnimationEnd = () => {
  setTimeout(() => emits('end'), 1000)
}

onMounted(() => {
  const containerWidth = container.value.offsetWidth
  const textWidth = text.value.scrollWidth

  if (textWidth > containerWidth) {
    running.value = true
    const speed = 100
    const distance = textWidth + containerWidth
    duration.value = distance / speed
    endtPos.value = -(textWidth - containerWidth + 12) + 'px'
  }
  else {
    setTimeout(() => emits('end'), 3000)
  }
})
</script>

<style scoped>
.TextRunning {
  animation: text-running linear forwards;
  animation-delay: 1s;
}

@keyframes text-running {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(var(--end-text-pos));
  }
}
</style>