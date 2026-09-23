<template>
  <USelectMenu
    v-model="item"
    searchable
    :options="options"
    size="sm"
    value-attribute="_id"
    option-attribute="name"
  >
    <template #label>
      <UiText mini>{{ select ? select.name : t('selectItemBox') }}</UiText>
    </template>
  </USelectMenu>
</template>

<script setup>
const { t } = useI18n()

const emits = defineEmits(['change'])

const options = ref([])

const item = ref()

const select = computed(() => options.value.find(i => i._id === item.value))

watch(item, (val) => {
  if(!val) return
  const box = options.value.find(i => i._id === val)
  emits('change', box ? box.gift : [])
  item.value = null
})

const fetch = async () => {
  const items = await useAPI('item/box/public/select')
  options.value = items
}

fetch()
</script>