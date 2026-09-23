<template>
  <USelectMenu
    v-model="category"
    :options="options"
    size="lg"
    value-attribute="_id"
    option-attribute="label"
    :disabled="options.length == 0"
    :loading="loading"
    v-if="!listBtn"
  >
    <template #label>
      <UiText mini>{{ select ? select.label : placeholder || t('selectShopCategory') }}</UiText>
    </template>
  </USelectMenu>

  <UiFlex class="gap-0.5" wrap v-else>
    <UButton 
      v-for="item in options" 
      :key="item._id"
      size="md"
      :class="{
        'bg-card-box text-gray-500': !select || (select && select._id != item._id),
        'bg-btn': (select && select._id == item._id) || (!select && item._id == null)
      }"
      @click="onClick(item)"
      color="gray"
    >{{ item.label }}</UButton>
  </UiFlex>
</template>

<script setup>
const { t } = useI18n()

const props = defineProps({
  modelValue: String,
  type: String,
  options: {
    type: Array,
    default: () => []
  },
  placeholder: String,
  listBtn: Boolean
})

const emits = defineEmits(['update:modelValue'])

const loading = ref(true)

const category = computed({
  get: () => props.modelValue || '',
  set: (value) => emits('update:modelValue', value)
}) 

const options = ref(props.options)
const select = computed(() => options.value.find(i => i._id === category.value))
const onClick = (item) => {
  category.value = item._id
}

const fetch = async () => {
  try {
    loading.value = true
    const list = await useAPI('shop/category/public/select', { type: props.type })
    
    options.value = options.value.concat(list.map(i => ({ _id: i._id, label: i.name })))
    loading.value = false
  }
  catch (e) {
    loading.value = false
  }
}
fetch()
</script>