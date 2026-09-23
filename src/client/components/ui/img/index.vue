<template>
  <div class="relative select-none UiImg" ref="imgRef" :style="aspectStyle">
    <!-- Placeholder -->
    <USkeleton class="absolute top-0 left-0 rounded-none w-full h-full" :style="{ borderRadius: 'inherit'  }" v-if="!!loading"></USkeleton>

    <!-- Ảnh thật -->
    <img
      v-if="shouldLoad"
      class="object-cover w-full h-full select-none"
      :src="imgSrc"
      :alt="alt"
      :loading="preload ? 'lazy' : undefined"
      :decoding="decoding"
      placeholder="/images/placeholder.png"
      @load="onLoad"
      @error="onError"
      draggable="false"
    />
  </div>
</template>

<script setup>
import { useIntersectionObserver } from '@vueuse/core'

const props = defineProps({
  src: String,
  w: [ String, Number ],
  h: [ String, Number ],
  alt: { type: String, default: 'image' },
  preload: { type: Boolean, default: true },
  decoding: { type: String, default: 'async' },
})

const imgRef = ref(null)
const loading = ref(true)

const shouldLoad = ref(false)
const isError = ref(false)
const imgSrc = computed(() => isError.value ? "/images/null.webp" : props.src || "/images/null.webp")

const aspectStyle = computed(() => {
  const w = props.w ?? "auto"
  const h = props.h ?? "auto"
  return `aspect-ratio: ${w} / ${h}`
})

function onLoad() {
  loading.value = false
}
function onError() {
  isError.value = true
  loading.value = false
}

const { stop } = useIntersectionObserver(
  imgRef,
  ([entry]) => {
    if(!entry) return
    if(entry.isIntersecting) {
      shouldLoad.value = true
      stop()
    }
  },
  {
    rootMargin: '300px',
    threshold: 0.01
  }
)
</script>

<style lang="sass">
.UiImg
  overflow: hidden
  img
    border-radius: inherit
    aspect-ratio: inherit
</style>