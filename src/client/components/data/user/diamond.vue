<template>
  <UButton color="gray" class="relative pr-10" :size="size" >
    <UiNumber :num="authStore.profile.currency.diamond">
      <template #default="{ display }">
        {{ !!auto ? (display > 999999 ? miniMoney(display) : toMoney(display)) : toMoney(display) }}
      </template>
    </UiNumber>
    <UiIcon name="i-ic-sharp-diamond" size="6" class="absolute right-2"/>
  </UButton>
</template>

<script setup>
const { toMoney, miniMoney } = useMoney()
const props = defineProps({
  size: {
    type: String,
    default: 'lg'
  },
  auto: {
    type: Boolean,
    default: false
  }
})
const authStore = useAuthStore()
</script>