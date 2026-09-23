<template>
  <USelectMenu 
    v-model="block" 
    size="lg" 
    value-attribute="value"
    :placeholder="t('selectAuthBlock')"
    :options="[
      { label: t('yes'), value: 1 },
      { label: t('no'), value: 0 }
    ]"
  >
    <template #label>
      <span v-if="block === undefined">{{ t('selectAuthBlock') }}</span>
      <span v-else>{{ block == 1 ? t('yes') : t('no') }}</span>
    </template>
  </USelectMenu>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps(['modelValue'])
const emits = defineEmits(['update:modelValue'])

const block = computed({
  get: () => props.modelValue || '',
  set: (value) => emits('update:modelValue', value)
}) 
</script>