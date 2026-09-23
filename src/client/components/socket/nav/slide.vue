<template>
  <UiEffectOb>
    <UChip color="rose" :show="count > 0" :text="count" position="top-left" :ui="{
      position: { 'top-left': 'top-2 left-1' }
    }">
      <UiFlex 
        type="col" justify="center" 
        class="relative h-[60px] max-h-[60px] md:h-[80px] md:max-h-[80px] cursor-pointer beat-anim" 
        @click="isOpen = true"
      >
        <img :src="`/images/icon/earth.png`" class="h-[40px] md:h-[50px] w-[40px] md:w-[50px] z-[1]" />
        <UiText class="text-[#79d5ec] FTV absolute bottom-[-5px] text-[0.6rem] sm:text-xs bg-card-box backdrop-blur rounded-2xl px-2 py-0.5 z-[1]" mini>
          {{ t('chat') }}
        </UiText>
      </UiFlex>
    </UChip>

    <USlideover v-model="isOpen" class="safe-area-top" :ui="{ width: 'w-screen max-w-[330px]' }">
      <SocketNav v-if="!!isOpen" class="h-full bg-card rounded-none" @close="isOpen = false"/>
    </USlideover>
  </UiEffectOb>
</template>

<script setup>
const { t } = useI18n()
const socketStore = useSocketStore()

const isOpen = ref(false)

const count = computed(() => {
 return socketStore.notify.single.new
})

watch(() => socketStore.slideModal, (val) => !!val && (isOpen.value = true))
watch(() => isOpen.value, (val) => {
  if(!val){
    socketStore.setSlideModal(false)
    socketStore.changeTab('chat-global')
  }
})
</script>