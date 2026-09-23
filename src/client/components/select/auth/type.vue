<template>
  <USelectMenu 
    v-model="type" 
    size="lg" 
    value-attribute="value"
    :placeholder="t('selectAuthType')"
    :options="[
      { label: 'MEMBER', value: 0 },
      { label: 'SMOD', value: 1 },
      { label: 'DEV', value: 2 },
      { label: 'ADMIN', value: 3 },
    ]"
  >
    <template #label>
      <UiDot :color="typeFormat[type].color" v-if="type !== undefined" />
      <span v-if="type !== undefined">{{ typeFormat[type].label }}</span>
      <span v-else>{{ t('selectAuthType') }}</span>
    </template>

    <template #option="{ option: option }">
      <UiDot :color="typeFormat[option.value].color" />
      <span>{{ typeFormat[option.value].label }}</span>
    </template>
  </USelectMenu>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps(['modelValue'])
const emits = defineEmits(['update:modelValue'])

const type = computed({
  get: () => props.modelValue || 0,
  set: (value) => emits('update:modelValue', value)
}) 

const typeFormat = {
  0: { label: 'MEMBER', color: 'gray' },
  1: { label: 'SMOD', color: 'green' },
  2: { label: 'DEV', color: 'cyan' },
  3: { label: 'ADMIN', color: 'red' }
}
</script>