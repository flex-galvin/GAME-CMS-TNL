<template>
  <UiFlex>
    <USelectMenu
      v-model="userSelect"
      :searchable="onSearch"
      :loading="loading"
      size="lg"
      option-attribute="label"
      by="_id"
      class="grow"
      :placeholder="t('searchUser')"
    >
    </USelectMenu>

    <UButton
      v-if="!!userSelect"
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
  userData: Object,
})

const emits = defineEmits(['update:modelValue', 'update:userData'])
const userSelect = ref(props.modelValue || '')
const loading = ref(false)

watch(userSelect, val => {
  if(!!val) {
    emits('update:modelValue', val._id)
    emits('update:userData', { _id: val._id, username: val.label })
  }
  else {
    emits('update:modelValue', undefined)
    emits('update:userData', undefined)
  }
})

const reset = () => {
  userSelect.value = undefined
}

const searchUsers = async (keyword) => {
  try {
    loading.value = true
    const data = await useAPI('user/public/search', { key: keyword.trim() })
    const users = data.map(user => ({ _id: user._id, label: user.username })).filter(Boolean)
    loading.value = false
    return users
  }
  catch(e){
    loading.value = false
    return []
  }
}

const searchDebounced = useDebounceFn(async (value) => {
  const data = await searchUsers(value)
  return data
}, 500)

const onSearch = async (value) => {
  loading.value = true
  const data = await searchDebounced(value)
  return data
}
</script>