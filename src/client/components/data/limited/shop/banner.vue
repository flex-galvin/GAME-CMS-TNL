<template>
  <UiFlex 
    v-if="pack"
    class="
      color-yellow-light bg-box-light bg-box-light--active-before 
      rounded-2xl 
      gap-4 
      pr-1
      overflow-hidden
      h-[150px] max:h-[150px]
      cursor-pointer
    "
    @click="configStore.setEventLimitedModal('shop', true)"
  >
    <img :src="`/images/limited/shop/chest.png`" class="absolute left-2 bottom-[-20px] h-[150px] w-auto z-[1] beat-2-anim" />
    
    <div class="grow z-[2] pl-[130px]">
      <UiFlex type="col" class="gap-1" items="center">
        <UiText class="FTV uppercase" align="center" size="xl">
          <UiCountdown :time="pack.time.end" />
        </UiText>

        <DataItemListMini :max="2" :items="pack.gift" justify="center" size="md" />
      </UiFlex>
    </div> 
  </UiFlex>
</template>

<script setup>
const configStore = useConfigStore()
const eventData = computed(() => configStore.eventLimited.shop.data || [])
const pack = computed(() => eventData.value[0])
</script>