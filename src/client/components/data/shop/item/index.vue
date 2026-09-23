<template>
  <UiEffectOb v-if="item">
    <UCard class="bg-card-box ring-1 cursor-pointer hover:scale-95 ease-in duration-200">
      <UiFlex type="col">
        <DataItemImage 
          :src="item.image || null"
          :type="item.type"
          :size="100"
          class="mb-0 mx-auto" 
        />

        <UiText mini weight="semibold" class="text-xs sm:text-sm md:text-lg line-clamp-1 mt-4 mb-0.5 max-w-[90%]">
          {{ item.item_amount > 1 ? `x${miniMoney(item.item_amount)}` : '' }} {{ item.name }}
        </UiText>

        <UiText 
          weight="semibold" 
          class="line-clamp-1 mb-2 md:mb-4 text-[0.6rem] sm:text-xs" 
          :color="(!!systemDiscount && systemDiscount.number > 0) ? 'red' : 'gray'"
        >
          {{ (!!systemDiscount && systemDiscount.number > 0) ? `${t('discount')} ${systemDiscount.number}%` : typeFormat[item.type] }}
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
const props = defineProps(['item', 'config'])
const { miniMoney } = useMoney()
const { dayjs, displayFull } = useDayJs()

const typeFormat = {
  'game_recharge': t('shopGameItem'),
  'game_item': t('shopGameRecharge'),
  'wheel': t('wheel'),
}

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
  if(!props.item) return 0
  if(!systemDiscount.value) return props.item.price

  const discount_system = systemDiscount.value.number
  const total = props.item.price - Math.floor(props.item.price * discount_system / 100)
  return total
})
</script>