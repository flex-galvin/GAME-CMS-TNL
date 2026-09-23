<template>
  <Transition name="page" mode="out-in">
    <DataEmpty :loading="loading" class="min-h-[300px]" v-if="!!loading || list.length == 0"></DataEmpty>

    <UCard v-else>
      <UiFlex type="col" class="grow gap-4">
        <UiFlex v-for="(item, index) in list" :key="index" class="w-full gap-4">
          <UiImg :src="`/images/rank/${item.rank}.png`" w="1" h="1" class="w-[40px] min-w-[40px] max-w-[40px] md:w-[55px] md:min-w-[55px] md:max-w-[55px]" />

          <div class="grow">
            <UiText mini weight="semibold" class="max-w-[70%] OPS text-gradient text-base md:text-lg">{{ item.role_name }}</UiText>
            <UiText mini class="text-xs md:text-sm" color="gray">{{ t('rank') }} {{ item.rank }}</UiText>
          </div>

          <UiText class="ml-auto FTV text-xs sm:text-base" mini>
            {{ type == 'level' ? useMoney().toMoney(item.level) : (item.power > 99999999 ? useMoney().miniMoney(item.power) : useMoney().toMoney(item.power)) }}
          </UiText>
        </UiFlex>
      </UiFlex>
    </UCard>
  </Transition>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps(['type', 'server'])

const loading = ref(true)

const list = ref([])

const getList = async () => {
  try {
    loading.value = true
    const type = props.type
    const server = props.server
    const ranks = await useAPI(`rank/public/${type}`, { server })
    
    list.value = ranks
    loading.value = false
  }
  catch(e){
    loading.value = false
  }
}

watch(() => props.server, () => getList())
watch(() => props.type, () => getList())
onMounted(() => setTimeout(getList, 1))
</script>