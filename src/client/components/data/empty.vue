<template>
  <UiFlex type="col" justify="center" class="p-4">
    <UiImg :src="image" w="1" h="1" class="w-[120px] h-[120px] mb-2" v-if="!loading" />

    <UiFlex class="mb-3" justify="center" v-else>
      <Loading />
    </UiFlex>

    <UiText align="center" class="text-gray-200 text-[0.65rem] sm:text-xs lg:text-sm" :color="color">{{ !!loading ? t('loading') : (text || t('emptyData')) }}</UiText>
  </UiFlex>
</template>

<script setup>
const { t } = useI18n()
defineProps({
  icon: {
    type: String,
    default: 'i-bx-data'
  },
  text: {
    type: String
  },
  image: {
    type: String,
    default: '/images/icon/empty-box.png'
  },
  color: {
    type: String,
    default: ''
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>