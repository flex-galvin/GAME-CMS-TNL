<template>
  <UiFlex>
    <UToggle v-model="pin" class="mr-2" />
    <UiText size="sm" weight="semibold" color="gray" text="Ghim" />
  </UiFlex>
</template>

<script setup>
const props = defineProps({
  modelValue: Number
})
const emits = defineEmits(['update:modelValue'])

const pin = computed({
  get: () => props.modelValue == 1 ? true : false,
  set: (value) => emits('update:modelValue', !!value ? 1 : 0)
}) 
</script>