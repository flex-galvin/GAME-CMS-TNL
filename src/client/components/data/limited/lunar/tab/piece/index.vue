<template>
  <UiFlex type="col" justify="center" v-if="!!eventData">
    <UiFlex type="col" class="gap-1 w-[300px] max-w-[300px] mb-4">
      <UiFlex class="gap-1">
        <UiFlex type="col" class="relative" v-for="item in ['A','B']">
          <UiImg :src="`/images/limited/lunar/piece/${item}.png`" w="1" h="1" class="rounded-2xl select-none pointer-events-none" :class="{
            'grayscale': (userEvent ? userEvent.piece ? userEvent.piece[item] : 0 : 0) == 0
          }"/>
          <UBadge class="!bg-black/80 !absolute bottom-2 right-2" v-if="!!authStore.isLogin">
            <span class="font-bold lunar-text">{{ userEvent ? userEvent.piece ? userEvent.piece[item] : 0 : 0 }}</span>
            {{ t('piece') }}
          </UBadge>
        </UiFlex>
      </UiFlex>

      <UiFlex class="gap-1">
        <UiFlex type="col" class="relative" v-for="item in ['C','D']">
          <UiImg :src="`/images/limited/lunar/piece/${item}.png`" w="1" h="1" class="rounded-2xl select-none pointer-events-none" :class="{
            'grayscale': (userEvent ? userEvent.piece ? userEvent.piece[item] : 0 : 0) == 0
          }"/>
          <UBadge class="!bg-black/80 !absolute bottom-2 right-2" v-if="!!authStore.isLogin">
            <span class="font-bold lunar-text">{{ userEvent ? userEvent.piece ? userEvent.piece[item] : 0 : 0 }}</span>
            {{ t('piece') }}
          </UBadge>
        </UiFlex>
      </UiFlex>
    </UiFlex>

    <UiFlex class="gap-1 mb-4" v-if="!!authStore.isLogin">
      <button class="lunar-btn px-2 sm:px-4 py-1 rounded-2xl text-[0.65rem] sm:text-sm font-bold text-black" @click="modal.history.collect = true">
        {{ t('limitedLunarPieceHistoryCollectBtn') }}
      </button>
      <button class="lunar-btn px-2 sm:px-4 py-1 rounded-2xl text-[0.65rem] sm:text-sm font-bold text-black" @click="modal.history.exchange = true">
        {{ t('limitedLunarPieceHistoryExchangeBtn') }}
      </button>
    </UiFlex>

    <DataLimitedLunarTabPieceExchange @exchange="getUser" />
    <UiText class="text-xs sm:text-sm lunar-text italic mt-4">{{ t('limitedLunarPieceHelp') }}</UiText>

    <UModal v-model="modal.history.collect" prevent-close :ui="{width: 'sm:max-w-[800px]'}">
      <UiContent :title="t('limitedLunarPieceHistoryCollect')" :sub="t('limitedLunarPieceHistoryCollectSub')" class="Lunar rounded-2xl p-4">
        <UiIcon name="i-bx-x" size="8" class="lunar-text absolute top-2 right-2 cursor-pointer z-1" @click="modal.history.collect = false" />

        <DataLimitedLunarTabPieceHistoryCollect />
      </UiContent>
    </UModal>

    <UModal v-model="modal.history.exchange" prevent-close :ui="{width: 'sm:max-w-[800px]'}">
      <UiContent :title="t('limitedLunarPieceHistoryExchange')" :sub="t('limitedLunarPieceHistoryExchangeSub')" class="Lunar rounded-2xl p-4">
        <UiIcon name="i-bx-x" size="8" class="lunar-text absolute top-2 right-2 cursor-pointer z-1" @click="modal.history.exchange = false" />

        <DataLimitedLunarTabPieceHistoryExchange />
      </UiContent>
    </UModal>
  </UiFlex>
</template>

<script setup>
const { t } = useI18n()

const emits = defineEmits(['back'])

const authStore = useAuthStore()
const configStore = useConfigStore()
const eventData = computed(() => configStore.eventLimited.lunar.data)
const userEvent = ref(null)

const loading = ref(true)
const modal = ref({
  history: {
    collect: false,
    exchange: false
  }
})

const getUser = async () => {
  try {
    loading.value = true
    const data = await useAPI('limited/lunar/public/user')

    userEvent.value = data
    loading.value = false
  }
  catch(e){
    userEvent.value = null
    loading.value = false
  }
}

onMounted(() => setTimeout(getUser, 1))
</script>