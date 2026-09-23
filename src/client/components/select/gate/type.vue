<template>
  <USelectMenu 
    v-model="type" 
    size="lg" 
    value-attribute="value"
    :options="[
      { label: t('gateCard'), value: 1 },
      { label: t('gateBank'), value: 2 },
      { label: t('gateMomo'), value: 3 }
    ]"
  >
    <template #label>
      <UiText mini>
        <span v-if="!type">{{ t('selectGate') }}</span>
        <span v-else-if="type == 1">{{ t('gateCard') }}</span>
        <span v-else-if="type == 2">{{ t('gateBank') }}</span>
        <span v-else-if="type == 3">{{ t('gateMomo') }}</span>
      </UiText>
    </template>
  </USelectMenu>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps(['modelValue'])
const emits = defineEmits(['update:modelValue'])

const type = ref(props.modelValue || '')
watch(type, (value) => {
  emits('update:modelValue', value)
})
</script>