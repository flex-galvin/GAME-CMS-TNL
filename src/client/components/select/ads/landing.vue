<template>
  <USelectMenu
    v-model="landing"
    :options="options"
    size="lg"
    value-attribute="_id"
    option-attribute="label"
    :disabled="options.length == 0"
    :loading="loading"
  >
    <template #label>
      <UiText mini>{{ select ? select.label : t('selectAdsLanding') }}</UiText>
    </template>
  </USelectMenu>
</template>

<script setup>
const { t } = useI18n()

const props = defineProps({
  modelValue: String,
  options: {
    type: Array,
    default: () => []
  }
})

const emits = defineEmits(['update:modelValue'])

const loading = ref(true)

const landing = computed({
  get: () => props.modelValue || '',
  set: (value) => emits('update:modelValue', value)
}) 

const options = ref(props.options)
const select = computed(() => options.value.find(i => i._id === landing.value))

const fetch = async () => {
  try {
    loading.value = true
    const list = await useAPI('ads/landing/public/select')
    
    options.value = options.value.concat(list.map(i => ({ _id: i._id, label: i.code })))
    loading.value = false
  }
  catch (e) {
    loading.value = false
  }
}
fetch()
</script>