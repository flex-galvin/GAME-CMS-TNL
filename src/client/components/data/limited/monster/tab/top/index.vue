<template>
  <div class="w-full monster-box p-4 pb-2 rounded-2xl">
    <DataEmpty v-if="!!loading || list.length == 0" :loading="loading" color="gray" image="/images/limited/monster/monster.png" />

    <UiFlex class="mb-2 gap-4" type="col" v-else>
      <UiFlex v-for="(item, index) in list" :key="index" class="w-full gap-2 sm:gap-4">
        <UiImg :src="`/images/rank/${item.rank}.png`" w="1" h="1" class="w-[30px] min-w-[30px] max-w-[30px] sm:w-[40px] sm:min-w-[40px] sm:max-w-[40px]" />

        <div class="grow">
          <UiText mini weight="semibold" class="max-w-[70%] OPS monster-text text-base md:text-lg lg:text-xl">{{ item.username }}</UiText>
          <UiText mini class="text-[0.65rem] sm:text-xs md:text-sm mt-[-5px] text-gray-500">{{ t('rank') }} {{ item.rank }}</UiText>
        </div>

        <button 
          class="monster-btn-2 px-2 sm:px-4 py-1 rounded-2xl text-[0.65rem] sm:text-sm font-bold text-black bounce-anim" 
          @click="openReceive(item.rank)"
          v-if="!!authStore.isLogin && !!eventData.rewardTime && !!myRank && (myRank == item.rank) && (item._id == authStore.profile._id)"
        >
          {{ t('receive') }}
        </button>

        <UiText class="ml-auto FTV text-xs sm:text-base" v-else>
          {{ useMoney().miniMoney(item.point) }}
        </UiText>
      </UiFlex>
    </UiFlex>
  
    <UiFlex>
      <UiFlex class="gap-1" v-if="!!authStore.isLogin && !!myRank">
        <UiText class="text-[0.65rem] sm:text-xs text-[#95a3b0]">{{ t('limitedMonsterTopMyRankText') }}</UiText>
        <UiText weight="bold" class="text-[0.65rem] sm:text-xs text-[#95a3b0]">{{ myRank }}</UiText>
      </UiFlex>

      <button class="monster-btn px-2 sm:px-4 py-1 rounded-2xl text-[0.65rem] sm:text-sm font-bold ml-auto" @click="modal.reward = true">
        {{ t('limitedMonsterTopAwardBtn') }}
      </button>
    </UiFlex>

    <UModal v-model="modal.reward" preventClose>
      <DataLimitedMonsterTabTopReward @close="modal.reward = false" />
    </UModal>

    <UModal v-model="modal.receive" preventClose>
      <DataLimitedMonsterTabTopReceive :rank="selectRank" @close="modal.receive = false" @done="modal.receive = false"  />
    </UModal>
  </div>
</template>

<script setup>
const { t } = useI18n()
const authStore = useAuthStore()
const configStore = useConfigStore()
const eventData = computed(() => configStore.eventLimited.monster.data)

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
    const data = await useAPI('limited/monster/public/top/list')
    list.value = data
    loading.value = false
  }
  catch(e){
    loading.value = false
  }
}

onMounted(() => setTimeout(getList, 1))
</script>
