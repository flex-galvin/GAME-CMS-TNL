<template>
  <UiImg 
    v-if="imgSrc"
    :src="imgSrc"
    :img-w="Number(size) * 2"
    :img-h="Number(size) * 2"
    w="1" h="1" 
    class="
      transition-all 
      rounded-2xl 
      overflow-hidden
      p-1
    "
    :style="{
      minWidth: size ? `${size}px` : null,
      minHeight: size ? `${size}px` : null,
      width: size ? `${size}px` : null,
      height: size ? `${size}px` : null,
      maxWidth: size ? `${size}px` : null,
      maxHeight: size ? `${size}px` : null,
    }"
    :key="key"
    :placeholder="'/images/icon/item.png'"
  ></UiImg>
</template>

<script setup>
const configStore = useConfigStore()
const props = defineProps({
  src: String,
  type: [ String, Number ],
  size: { type: [ String, Number, undefined ], default: 55 }
})

const typeFormat = {
  'game_recharge': 'recharge',
  'game_item': 'item',
  'coin': 'coin',
  'wheel': 'wheel',
  'empty-gift': 'empty-gift',
  'wheel_lose': 'wheel_lose'
}

const imgSrc = computed(() => {
  if(!!props.src){
    if(props.type == 'custom') return props.src
    
    const imagePath = configStore.config.game.image
    return !imagePath ? props.src : `${imagePath}/${props.src}`
  }
  else {
    if(!!props.type) return `/images/icon/${typeFormat[props.type]}.png`
    return null
  }
})

const key = computed(() => {
  const now = new Date()
  return imgSrc.value + '-' + now.getTime() + '-' + (Math.floor(Math.random() * (99 - 10)) + 10)
})
</script>