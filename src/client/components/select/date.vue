<template>
  <div>
    <VCalendarDatePicker
      v-model="date"
      transparent
      borderless
      :mode="mode"
      :color="appConfig.ui.primary"
      :is-dark="isDark"
    >
      <template #default="{ togglePopover }">
        <UiFlex class="relative">
          <UInput 
            class="grow"
            readonly
            :model-value="show" 
            @click="togglePopover" 
            :placeholder="props.placeholder || t('selectDate')"
            :size="size"
          />
          <UIcon 
            v-if="!!props.modelValue"
            name="i-bx-x" 
            color="gray" 
            pointer 
            class="absolute right-2"
            @click="emits('update:modelValue', null)" 
          />
        </UiFlex>
      </template>
    </VCalendarDatePicker>
  </div>
</template>

<script setup>
import { DatePicker as VCalendarDatePicker } from 'v-calendar'
import 'v-calendar/dist/style.css'

const { t } = useI18n()
const { displayFull, displayTime } = useDayJs()
const props = defineProps({ 
  modelValue: Date,
  time: Boolean,
  placeholder: String,
  size: String
})
const emits = defineEmits(['update:modelValue'])

const appConfig = useAppConfig()
const colorMode = useColorMode()
const isDark = computed(() => colorMode.value == 'dark')

const mode = computed(() => !!props.time ? 'dateTime' : 'date')

const date = computed({
  get: () => props.modelValue || '',
  set: (value) => emits('update:modelValue', value)
})

const show = computed(() => {
  if(!date.value) return null
  if(!!props.time) return displayFull(date.value)
  else return displayTime(date.value)
})
</script>

<style lang="sass">
:root
  --vc-gray-50: rgb(var(--color-gray-50))
  --vc-gray-100: rgb(var(--color-gray-100))
  --vc-gray-200: rgb(var(--color-gray-200))
  --vc-gray-300: rgb(var(--color-gray-300))
  --vc-gray-400: rgb(var(--color-gray-400))
  --vc-gray-500: rgb(var(--color-gray-500))
  --vc-gray-600: rgb(var(--color-gray-600))
  --vc-gray-700: rgb(var(--color-gray-700))
  --vc-gray-800: rgb(var(--color-gray-800))
  --vc-gray-900: rgb(var(--color-gray-900))
  --vc-accent-50: rgb(var(--color-primary-50))
  --vc-accent-100: rgb(var(--color-primary-100))
  --vc-accent-200: rgb(var(--color-primary-200))
  --vc-accent-300: rgb(var(--color-primary-300))
  --vc-accent-400: rgb(var(--color-primary-400))
  --vc-accent-500: rgb(var(--color-primary-500))
  --vc-accent-600: rgb(var(--color-primary-600))
  --vc-accent-700: rgb(var(--color-primary-700))
  --vc-accent-800: rgb(var(--color-primary-800))
  --vc-accent-900: rgb(var(--color-primary-900))
  

.vc-time-select-group
  --vc-time-select-group-bg: rgb(var(--color-gray-900))
  
.vc-popover-content
  background: #0b0b0b
  border-radius: 12px
  box-shadow: 0 0 13px 4px rgba(0,0,0,0.5)
  border: none
  .vc-container
    .vc-time-picker
      border: none
      .vc-time-select-group
        border: none
        padding: 3px
        .vc-base-icon
          display: none
</style>