<template>
  <Transition name="page" mode="out-in">
    <DataEmpty v-if="!!loading || list.length == 0" :loading="loading" class="min-h-[300px]"></DataEmpty>

    <div class="@container grid grid-cols-12 gap-2" v-else>
      <UiEffectOb v-for="(row, index) in list" :key="index" class="@4xl:col-span-3 @xl:col-span-4 col-span-6">
        <UCard>
          <UiFlex type="col">
            <UiText mini weight="bold" class="text-gradient FTV text-lg line-clamp-1 mb-4 max-w-[90%]">
              {{ row.code }}
            </UiText>

            <DataItemListMini :max="2" :items="row.gift" justify="center" class="mb-4" />

            <UiText weight="semibold" class="text-[0.6rem] sm:text-xs line-clamp-1" color="gray">{{ row.gift.length }} {{ t('item') }}</UiText>

            <UButton @click="fast(row.code)" class="px-4 md:px-6 max-w-full bg-btn mt-4">{{ t('receive') }}</UButton>
          </UiFlex>
        </UCard>
      </UiEffectOb>
    </div>
  </Transition>
</template>

<script setup>
const { t } = useI18n()

const props = defineProps(['giftcodes', 'landing'])
const emits = defineEmits(['update:giftcodes', 'fast', 'landing'])

const loading = ref(true)
const list = ref([])

const fast = (code) => {
  if(!!props.landing) emits('landing')
  else emits('fast', code)
}

const getPublic = async () => {
  try {
    loading.value = true
    const data = await useAPI('giftcode/public/overt')

    list.value = data
    loading.value = false
    emits('update:giftcodes', data)
  }
  catch (e){
    list.value = []
    loading.value = false
    emits('update:giftcodes', null)
  }
}

onMounted(() => setTimeout(getPublic, 1))
</script>