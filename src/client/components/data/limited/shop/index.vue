<template>
  <UiContent :title="pack.name" :sub="t('limitedShopSub')" class="LimitedShop p-4 rounded-2xl" v-if="!!pack">
    <template #more>
      <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="onNextOrClose"></UButton>
    </template>

    <UiText class="text-[3rem] sm:text-[3.5rem] OPS text-gradient" weight="bold" align="center" v-if="!!pack.time">
      <UiCountdown :time="pack.time.end" @end="onNextOrClose" />
    </UiText>

    <UiFlex justify="center">
      <UBadge color="gray" size="xs" class="px-3">
        <UiText>{{ t('sold') }}</UiText>
        <UiText color="green" weight="bold" class="mx-0.5" v-if="pack.limit > 0">{{ pack.buyed }} / {{ pack.limit }}</UiText>
        <UiText color="green" weight="bold" class="mx-0.5" v-else>{{ pack.buyed }}</UiText>
        <UiText>{{ t('pack') }}</UiText>
      </UBadge>
    </UiFlex>
    
    <DataItemList class="my-6" justify="center" :items="pack.gift" :size="60" v-if="!!pack.gift" />

    <UButton block class="bg-animate !text-white" @click="onSelect(pack)">
      <UiFlex type="col">
        <UiText size="xs" class="mt-1.5">{{ t('buyNow') }}</UiText>
        <UiText size="2xl" weight="bold" class="OPS bounce-anim">{{ useMoney().toMoney(pack.price) }}</UiText>
      </UiFlex>
    </UButton>

    <UModal v-model="modal" prevent-close>
      <DataLimitedShopBuy :pack="select" @close="modal = false" @done="onNextOrClose" class="p-4"/>
    </UModal>
  </UiContent>
</template>

<script setup>
const authStore = useAuthStore()
const { t } = useI18n()
const emits = defineEmits(['close'])
const configStore = useConfigStore()
const eventData = computed(() => JSON.parse(JSON.stringify(configStore.eventLimited.shop.data || [])))

const pack = ref(null)
const index = ref(0)

const select = ref(null)
const modal = ref(false)

const onNextOrClose = () => {
  index.value = index.value + 1
  if(eventData.value[index.value]){
    pack.value = eventData.value[index.value]
  }
  else {
    emits('close')
  }
}

const onSelect = (item) => {
  if(!authStore.isLogin) return authStore.setModal(true)
  select.value = item
  modal.value = true
}

onMounted(() => {
  if(eventData.value.length > 0) pack.value = eventData.value[index.value]
  else index.value = 0, pack.value = null
})
</script>