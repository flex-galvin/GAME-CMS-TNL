<template>
  <div class="@container" v-if="list.length > 0">
    <UiFlex justify="between" class="gap-2 mb-2" wrap>
      <UiTitle :name="t('gameOther')" icon="i-famicons-game-controller" />
    </UiFlex>

    <UiEffectOb>
      <ClientOnly>
        <swiper-container 
          ref="containerRef" 
          :slides-per-view="'auto'"
          :autoplay="{ delay: 2500, disableOnInteraction: false }" 
          :loop="true"
          class="rounded-2xl overflow-hidden"
        >
          <swiper-slide v-for="(item, idx) in list" :key="idx" class="@2xl:w-1/3 w-1/2 px-0.5">
            <DataGameBox :game="item"/>
          </swiper-slide>
        </swiper-container>
      </ClientOnly>
    </UiEffectOb>
  </div>
</template>

<script setup>
const { t } = useI18n()
const list = ref([])

const getList = async () => {
  try {
    const data = await useAPI('game/public/more')
    list.value = data
  }
  catch (e) {
    list.value = []
  }
}

onMounted(() => getList())
</script>