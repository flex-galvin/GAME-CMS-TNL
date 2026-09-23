<template>
  <div>
    <!-- Button Drag -->
    <div id="ButtonDrag" class="bg-btn before:hidden !overflow-visible shadow-2xl rounded-full touch-none" :style="style" ref="el" @click="toggleMenu">
      <div class="bg-btn !absolute rounded-full w-full h-full z-[-1] animate-ping touch-none pointer-events-none select-none"></div>
      <UiIcon name="i-bxs-grid-alt" class="animate-bounce" size="6" />
    </div>

    <!-- Overlay -->
    <UiFlex 
      justify="center"
      class="fixed w-full h-full top-0 left-0 !items-start sm:!items-center" 
      :class="{
        'bg-black/50 backdrop-blur-xl': !!open
      }"
      v-if="!!dragging || !!open"
    >
      <div class="absolute w-full h-full top-0 left-0 cursor-pointer" @click="toggleMenu" v-if="!!open"></div>

      <UiFlex class="absolute top-2 right-2 gap-1" v-if="!!open">
        <UButton color="gray" icon="i-bx-x" square  @click="toggleMenu" size="lg"></UButton>
      </UiFlex>
      
      <!-- <UiIcon name="i-bx-x" class="absolute top-2 right-2 cursor-pointer" size="10" square @click="toggleMenu" v-if="!!open"></UiIcon> -->
      
      <LayoutPlayMenu class="mt-12 sm:mt-0" :admin="admin" v-if="!!open"/>
      <LayoutPublicMenuMini v-if="!!open" />
    </UiFlex>
  </div>
</template>

<script setup>
import { useDraggable } from '@vueuse/core'
const props = defineProps(['admin'])
const open = ref(false)

const el = ref(null)
const dragging = ref(false)

const { style } = useDraggable(el, {
  initialValue: { x: -6, y: -6 },
  exact: false,
  preventDefault: true,
  onMove: () => {
    dragging.value = true
  },
  onEnd: () => {
    dragging.value = false
  }
})

const toggleMenu = () => {
  if(!!dragging.value) return
  open.value = !open.value
}
</script>

<style lang="sass">
#ButtonDrag
  position: fixed
  display: inline-flex
  align-items: center
  justify-content: center
  min-width: 50px
  min-height: 50px
  width: 50px
  height: 50px
  max-width: 50px
  max-height: 50px
  cursor: pointer
</style>