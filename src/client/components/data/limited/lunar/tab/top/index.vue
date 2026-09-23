<template>
  <div class="w-full">
    <div class="lunar-box p-4 rounded-2xl mb-2">
      <DataEmpty v-if="!!loading || list.length == 0" :loading="loading" color="gray" />

      <UiFlex class="gap-4" type="col" v-else>
        <UiFlex v-for="(item, index) in list" :key="index" class="w-full gap-2 sm:gap-4">
          <UiImg :src="`/images/rank/${item.rank}.png`" w="1" h="1" class="w-[40px] min-w-[40px] max-w-[40px]" />

          <div class="grow">
            <UiText mini weight="semibold" class="max-w-[70%] OPS lunar-text text-base md:text-lg lg:text-xl">{{ item.username }}</UiText>
            <UiText mini class="text-[0.65rem] sm:text-xs text-gray-300">{{ t('rank') }} {{ item.rank }}</UiText>
          </div>

          <button 
            class="lunar-btn px-2 sm:px-4 py-1 rounded-2xl text-[0.65rem] sm:text-sm font-bold text-black mt-2 bounce-anim" 
            @click="openReceive(item.rank)"
            v-if="!!authStore.isLogin && !!eventData.rewardTime && !!myRank && (myRank == item.rank) && (item._id == authStore.profile._id)"
          >
            {{ t('receive') }}
          </button>

          <UiText class="ml-auto FTV text-xs sm:text-base lunar-text-3" v-else>
            {{ useMoney().miniMoney(item.point) }}
          </UiText>
        </UiFlex>
      </UiFlex>
    </div>
  
    <UiFlex>
      <UiFlex class="gap-1" v-if="!!authStore.isLogin && !!myRank">
        <UiText class="text-xs sm:text-sm">{{ t('limitedLunarTopMyRankText') }}</UiText>
        <UiText weight="bold" class="text-xs sm:text-sm lunar-text">{{ myRank }}</UiText>
      </UiFlex>

      <button class="lunar-btn px-2 sm:px-4 py-1 rounded-2xl text-[0.65rem] sm:text-sm font-bold text-black ml-auto" @click="modal.reward = true">
        {{ t('limitedLunarTopAwardBtn') }}
      </button>
    </UiFlex>

    <UModal v-model="modal.reward" preventClose>
      <DataLimitedLunarTabTopReward @close="modal.reward = false" />
    </UModal>

    <UModal v-model="modal.receive" preventClose>
      <DataLimitedLunarTabTopReceive :rank="selectRank" @close="modal.receive = false" @done="modal.receive = false"  />
    </UModal>
  </div>
</template>

<script setup>
const { t } = useI18n()
const authStore = useAuthStore()
const configStore = useConfigStore()
const eventData = computed(() => configStore.eventLimited.lunar.data)

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
    const data = await useAPI('limited/lunar/public/top/list')
    list.value = data
    loading.value = false
  }
  catch(e){
    loading.value = false
  }
}

onMounted(() => setTimeout(getList, 1))
</script>
