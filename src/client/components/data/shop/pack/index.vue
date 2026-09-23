<template>
  <UiEffectOb v-if="pack" >
    <UCard class="bg-card-box ring-1 cursor-pointer hover:scale-95 ease-in duration-200">
      <UiFlex type="col">
        <UiText mini weight="semibold" class="text-xs sm:text-sm md:text-lg line-clamp-1 mb-4 max-w-[90%]">
          {{ pack.name }}
        </UiText>

        <DataItemListMini justify="center" :items="pack.gift" :max="max" :no-view="true" />

        <UiText 
          weight="semibold" 
          class="line-clamp-1 my-4 text-[0.6rem] sm:text-xs" 
          :color="(!!systemDiscount && systemDiscount.number > 0) ? 'red' : 'gray'"
        >
          {{ (!!systemDiscount && systemDiscount.number > 0) ? `${t('discount')} ${systemDiscount.number}%` : `${pack.gift.length} ${t('item')}` }}
        </UiText>

        <UButton color="gray" class="px-4 md:px-6 max-w-full">
          {{ miniMoney(totalPrice) }}
          <UiIcon name="i-game-icons-two-coins" class="ml-1" size="5"/>
        </UButton>
      </UiFlex>
    </UCard>
  </UiEffectOb>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps(['pack', 'config', 'max'])
const { miniMoney } = useMoney()
const { dayjs, displayFull } = useDayJs()

const systemDiscount = computed(() => {
  if(!props.config) return null

  let number = 0
  let time = ''
  const discount = parseInt(props.config.discount.number || 0)
  const expired = props.config.discount.expired || null

  if(!expired) number = discount, time = ''
  else {
    const nowTime = dayjs(Date.now()).unix()
    const expiredTime = dayjs(expired).unix()
    if(nowTime <= expiredTime) number = discount, time = `${t('toDate')} ${displayFull(expired)}`
    else number = 0, time = ''
  }

  return { number, time }
})

const totalPrice = computed(() => {
  if(!props.pack) return 0
  if(!systemDiscount.value) return props.pack.price

  const discount_system = systemDiscount.value.number
  const total = props.pack.price - Math.floor(props.pack.price * discount_system / 100)
  return total
})
</script>