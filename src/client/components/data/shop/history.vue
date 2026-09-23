<template>
  <div>
    <UiFlex class="mb-1">
      <UTabs v-model="tab" :items="tabs"></UTabs>
    </UiFlex>

    <DataShopItemHistory v-if="tab == 0" :user="user" />
    <DataShopPackHistory v-if="tab == 1" :user="user" />
  </div>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps(['user'])

const tab = ref(0)
const tabs = [
  { label: t('menuShopItem'), key: 'item' },
  { label: t('menuShopPack'), key: 'pack' }
]
</script>
