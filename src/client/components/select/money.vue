<template>
  <USelectMenu 
    v-model="money" 
    size="lg" 
    value-attribute="value"
    :options="[
      { label: t('coin'), value: 'coin' },
      { label: t('diamond'), value: 'diamond' }
    ]"
  >
    <template #label>
      <span v-if="money === undefined">{{ t('selectCurrency') }}</span>
      <span v-else>{{ money == 'coin' ? t('coin') : t('diamond') }}</span>
    </template>
  </USelectMenu>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps(['modelValue'])
const emits = defineEmits(['update:modelValue'])

const money = computed({
  get: () => props.modelValue || 'coin',
  set: (value) => emits('update:modelValue', value)
})
</script>