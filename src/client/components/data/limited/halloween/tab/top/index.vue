<template>
  <div class="w-full">
    <DataEmpty v-if="!!loading || list.length == 0" :loading="loading" class="min-h-[300px]" />

    <UiFlex class="halloween-box p-4 rounded-2xl w-full mb-2 gap-4" type="col" v-else>
      <UiFlex v-for="(item, index) in list" :key="index" class="w-full gap-2 sm:gap-4">
        <UiImg :src="`/images/rank/${item.rank}.png`" w="1" h="1" class="w-[40px] min-w-[40px] max-w-[40px]" />

        <div class="grow">
          <UiText mini weight="semibold" class="max-w-[70%] OPS text-gradient text-base md:text-lg lg:text-xl">{{ item.username }}</UiText>
          <UiText mini class="text-[0.65rem] sm:text-xs md:text-sm mt-[-5px]" color="gray">{{ t('rank') }} {{ item.rank }}</UiText>
        </div>

        <button 
          class="halloween-btn-2 px-2 sm:px-4 py-1 rounded-2xl text-[0.65rem] sm:text-sm font-bold text-black mt-2 bounce-anim" 
          @click="openReceive(item.rank)"
          v-if="!!authStore.isLogin && !!eventData.rewardTime && !!myRank && (myRank == item.rank) && (item._id == authStore.profile._id)"
        >
          {{ t('receive') }}
        </button>

        <UiText class="ml-auto FTV halloween-text text-xs sm:text-base" v-else>
          {{ useMoney().miniMoney(item.point) }}
        </UiText>
      </UiFlex>
    </UiFlex>

    <UiFlex>
      <UiFlex class="gap-1" v-if="!!authStore.isLogin && !!myRank">
        <UiText class="text-xs sm:text-sm halloween-text">{{ t('limitedHalloweenTopMyRankText') }}</UiText>
        <UiText class="text-xs sm:text-sm">{{ myRank }}</UiText>
      </UiFlex>

      <button class="halloween-btn-2 px-2 sm:px-4 py-1 rounded-2xl text-[0.65rem] sm:text-sm font-bold text-black ml-auto" @click="modal.reward = true">
        {{ t('limitedHalloweenTopAwardBtn') }}
      </button>
    </UiFlex>

    <UModal v-model="modal.reward" preventClose>
      <DataLimitedHalloweenTabTopReward @close="modal.reward = false" />
    </UModal>

    <UModal v-model="modal.receive" preventClose>
      <DataLimitedHalloweenTabTopReceive :rank="selectRank" @close="modal.receive = false" @done="modal.receive = false"  />
    </UModal>
  </div>
</template>

<script setup>
const { t } = useI18n()
const authStore = useAuthStore()
const configStore = useConfigStore()
const eventData = computed(() => configStore.eventLimited.halloween.data)

const loading = ref(true)
const list = ref([])
const modal = ref({
  reward: false,
  receive: false
})

const selectRank = ref(0)
const openReceive = (rank) => {
  selectRank.value = rank
  modal.value.receive = true
}

const myRank = computed(() => {
  if(!authStore.isLogin) return false
  if(!authStore.profile) return false
  const index = list.value.findLastIndex(i => i._id.toString() == authStore.profile._id.toString())
  if(index < 0) return false
  return list.value[index].rank
})

const getList = async () => {
  try {
    loading.value = true
    const data = await useAPI('limited/halloween/public/top/list')
    list.value = data
    loading.value = false
  }
  catch(e){
    loading.value = false
  }
}

onMounted(() => setTimeout(getList, 1))
</script>
