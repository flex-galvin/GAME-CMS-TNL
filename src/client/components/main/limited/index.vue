<template>
  <MainLimitedPay />
  <MainLimitedShop />
  <MainLimitedHalloween />
  <MainLimitedChristmas />
  <MainLimitedMonster />
  <MainLimitedLootchest />
  <MainLimitedLunar />
</template>

<script setup>
const configStore = useConfigStore()

const remove = () => {
  configStore.removeEventLimited('halloween')
  configStore.removeEventLimited('christmas')
  configStore.removeEventLimited('shop')
  configStore.removeEventLimited('pay')
  configStore.removeEventLimited('monster')
  configStore.removeEventLimited('lootchest')
  configStore.removeEventLimited('lunar')
}

const getData = async () => {
  try {
    const data = await useAPI('limited/get')

    if(!!data.pay) configStore.setEventLimited('pay', data.pay)
    else configStore.removeEventLimited('pay')

    if(!!data.shop) configStore.setEventLimited('shop', data.shop)
    else configStore.removeEventLimited('shop')

    if(!!data.halloween) configStore.setEventLimited('halloween', data.halloween)
    else configStore.removeEventLimited('halloween')

    if(!!data.christmas) configStore.setEventLimited('christmas', data.christmas)
    else configStore.removeEventLimited('christmas')

    if(!!data.monster) configStore.setEventLimited('monster', data.monster)
    else configStore.removeEventLimited('monster')

    if(!!data.lootchest) configStore.setEventLimited('lootchest', data.lootchest)
    else configStore.removeEventLimited('lootchest')

    if(!!data.lunar) configStore.setEventLimited('lunar', data.lunar)
    else configStore.removeEventLimited('lunar')
  }
  catch(e){
    remove()
  }
}

onMounted(() => setTimeout(getData, 1000))
onUnmounted(() => remove())
</script>