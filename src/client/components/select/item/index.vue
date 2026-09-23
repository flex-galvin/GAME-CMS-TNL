<template>
  <UiFlex>
    <USelectMenu
      v-model="itemSelect"
      :searchable="onSearch"
      :loading="loading"
      size="lg"
      option-attribute="item_name"
      by="_id"
      class="grow"
      :placeholder="t('searchItem')"
    >
    </USelectMenu>

    <UButton
      v-if="!!itemSelect"
      icon="i-bx-x"
      color="gray" 
      class="ml-1" 
      size="lg" 
      @click="reset"
    ></UButton>
  </UiFlex>
</template>

<script setup>
const { t } = useI18n()
import { useDebounceFn } from '@vueuse/core'

const props = defineProps({
  modelValue: String,
  itemData: Object,
  types: { type: Array, default: () => [] }
})

const emits = defineEmits(['update:modelValue', 'update:itemData'])
const itemSelect = ref(props.modelValue || '')
const loading = ref(false)

watch(itemSelect, val => {
  if(!!val) {
    emits('update:modelValue', val._id)
    emits('update:itemData', val)
  }
  else {
    emits('update:modelValue', undefined)
    emits('update:itemData', undefined)
  }
})

const reset = () => {
  itemSelect.value = undefined
}

const searchItems = async (keyword) => {
  try {
    loading.value = true

    const data = await useAPI('item/game/public/search', {
      key: keyword.trim(),
      types: JSON.parse(JSON.stringify(props.types))
    })
    const items = data.map(i => ({ 
      _id: i._id, 
      item_id: i.item_id,
      item_name: i.item_name,
      item_image: i.item_image,
      type: i.type
    })).filter(Boolean)

    loading.value = false
    return items
  }
  catch(e){
    loading.value = false
    return []
  }
}

const searchDebounced = useDebounceFn(async (value) => {
  const data = await searchItems(value)
  return data
}, 500)

const onSearch = async (value) => {
  loading.value = true
  const data = await searchDebounced(value)
  return data
}
</script>