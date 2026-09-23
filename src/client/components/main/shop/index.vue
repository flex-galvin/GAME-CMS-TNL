<template>
  <div>
    <DataEmpty :text="t('shopMaintenance')" v-if="!active" />

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
        <MainShopRecharge v-if="tab === 'recharge'" :scroll="scroll" />
        <MainShopItem v-else-if="tab === 'item'" :scroll="scroll" />
        <MainShopPack v-else-if="tab === 'pack'" :scroll="scroll" />
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
const show = ref(configStore.config.menu.shop)

const items = computed(() => {
  const list =  []
  if(!!show.value.recharge) list.push({ label: t('menuShopRecharge'), type: 'recharge', icon: 'i-simple-icons-gamejolt' })
  if(!!show.value.item) list.push({ label: t('menuShopItem'), type: 'item', icon: 'i-pajamas-work-item-ticket' })
  if(!!show.value.pack) list.push({ label: t('menuShopPack'), type: 'pack', icon: 'i-ix-package-filled' })
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