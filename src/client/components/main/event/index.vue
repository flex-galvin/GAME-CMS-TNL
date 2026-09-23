<template>
  <div>
    <DataEmpty :text="t('eventMaintenance')" v-if="!active" />

    <div v-else>
      <ClientOnly>
        <swiper-container 
          :freeMode="true"
          :spaceBetween="5"
          slidesPerView="auto"
          class="rounded-2xl overflow-hidden mb-4"
          v-if="items.length > 1"
        >
          <swiper-slide v-for="(option, index) in items" :key="index" class="!inline-block !w-auto">
            <UiButtonSelect
              @click="select(option.type)"
              :active="!!tab && tab == option.type"
              class="py-2 md:py-3 px-4  md:min-w-[145px]"
            >
              <UiFlex class="lg:flex-col lg:gap-1 flex-row gap-3">
                <UiIcon :name="option.icon" class="w-5 h-5 md:h-6 md:w-6 lg:h-8 lg:w-8" />
                <UiText weight="bold" class="text-xs sm:text-sm md:text-base">{{ option.label }}</UiText>
              </UiFlex>
            </UiButtonSelect>
          </swiper-slide>
        </swiper-container >
      </ClientOnly>

      <Transition name="page" mode="out-in">
        <MainEventPower v-if="tab === 'powerup'" :scroll="scroll" />
        <MainEventReferral v-else-if="tab === 'referral'" :scroll="scroll" />
        <MainEventLogin v-else-if="tab === 'login'" :scroll="scroll" />
        <MainEventPay v-else-if="tab === 'pay'" :scroll="scroll" />
        <MainEventSpend v-else-if="tab === 'spend'" :scroll="scroll" />
        <MainEventPaymusty v-else-if="tab === 'paymusty'" :scroll="scroll" />
        <MainEventPaydays v-else-if="tab === 'paydays'" :scroll="scroll" />
      </Transition>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()

const props = defineProps({
  scroll: Boolean
})
const configStore = useConfigStore()
const show = ref(configStore.config.menu.event)

const items = computed(() => {
  const list =  []
  if(!!show.value.powerup) list.push({ label: t('menuEventPower'), type: 'powerup', icon: 'i-mdi-trending-up' })
  if(!!show.value.referral) list.push({ label: t('menuEventReferral'), type: 'referral', icon: 'i-weui-add-friends-filled' })
  if(!!show.value.login) list.push({ label: t('menuEventLogin'), type: 'login', icon: 'i-material-symbols-today' })
  if(!!show.value.pay) list.push({ label: t('menuEventPay'), type: 'pay', icon: 'i-material-symbols-payment-arrow-down-outline-rounded' })
  if(!!show.value.spend) list.push({ label: t('menuEventSpend'), type: 'spend', icon: 'i-game-icons-pay-money' })
  if(!!show.value.paymusty) list.push({ label: t('menuEventPaymusty'), type: 'paymusty', icon: 'i-fluent-money-hand-20-filled' })
  if(!!show.value.paydays) list.push({ label: t('menuEventPaydays'), type: 'paydays', icon: 'i-game-icons-take-my-money' })
  return list
})
const tab = ref(!!items.value[0] ? items.value[0].type : null)

const select = (type) => {
  tab.value = type
}
const active = computed(() => {
  if(items.value.length === 0) return false
  return true
})
</script>