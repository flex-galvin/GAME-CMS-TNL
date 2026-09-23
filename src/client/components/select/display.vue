<template>
  <USelectMenu 
    v-model="display" 
    size="lg" 
    value-attribute="value"
    :options="[
      { label: t('show'), value: 1 },
      { label: t('hide'), value: 0 }
    ]"
  >
    <template #label>
      <span v-if="display === undefined">{{ t('selectDisplay') }}</span>
      <span v-else>{{ display == 1 ? t('show') : t('hide') }}</span>
    </template>
  </USelectMenu>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps(['modelValue'])
const emits = defineEmits(['update:modelValue'])

const display = computed({
  get: () => props.modelValue,
  set: (value) => emits('update:modelValue', value)
}) 
</script>