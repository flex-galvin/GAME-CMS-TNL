<template>
  <UiFlex wrap :justify="justify" class="gap-0.5">
    <UiText size="sm" class="text-gray-600 italic" v-if="!items || items.length == 0">{{empty || t('noItemsYet')}}</UiText>
    <DataItem v-for="(data, index) in items" :key="index" :item="data.item" :size="size" :amount="data.amount" />
  </UiFlex>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps(['items', 'empty', 'justify', 'size'])
</script>