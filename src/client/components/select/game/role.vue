<template>
  <USelectMenu
    v-model="role"
    :options="options"
    size="lg"
    value-attribute="value"
    option-attribute="label"
    :disabled="options.length == 0"
    :loading="loading"
  >
    <template #label>
      <UiText mini>{{ select ? select.label : t('selectGameRole') }}</UiText>
    </template>
  </USelectMenu>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps(['modelValue', 'roleData', 'server', 'user'])
const emits = defineEmits(['update:modelValue', 'update:roleData'])

const loading = ref(true)

const role = computed({
  get: () => props.modelValue || '',
  set: (value) => emits('update:modelValue', value)
}) 

const options = ref([])

const select = computed(() => options.value.find(i => i.value === role.value))

watch(select, val => {
  if(!val) return emits('update:roleData', undefined)
  emits('update:roleData', {
    role_id: val.value,
    role_name: val.label
  })
})

watch(() => props.server, (val) => !!val && fetch())
watch(() => props.user, (val) => !!val && fetch())

const fetch = async () => {
  try {
    if(!props.server) return

    loading.value = true
    const list = await useAPI('game/public/role', { server: props.server, user: props.user })

    loading.value = false
    options.value = list.map(i => ({ value: i.role_id, label: i.role_name }))

    if(options.value.length == 1){
      role.value = options.value[0].value
    }
    else {
      role.value = null
    }
  }
  catch (e) {
    loading.value = false
    options.value = []
  }
}

fetch()
</script>