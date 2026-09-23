<template>
  <div v-if="!!config">
    <UiText  color="gray" size="sm" v-if="!!config.start && !!config.end">
      {{ t('fromDate') }} <span class="text-green-400 font-semibold italic">{{ useDayJs().displayFull(config.start) }} </span> 
      {{ t('toDate') }} <span class="text-rose-400 font-semibold italic">{{ useDayJs().displayFull(config.end) }} </span> 
    </UiText>
    <UiText  color="gray" size="sm" v-else-if="!!config.start && !config.end">
      {{ t('start') }} <span class="text-green-400 font-semibold italic">{{ useDayJs().displayFull(config.start) }} </span> 
    </UiText>
    <UiText  color="gray" size="sm" v-else-if="!config.start && !!config.end">
      {{ t('end') }} <span class="text-rose-400 font-semibold italic">{{ useDayJs().displayFull(config.end) }} </span> 
    </UiText>
    <UiText color="gray" size="sm" v-else-if="!config.start && !config.end">
      <span class="text-green-400 font-semibold italic mr-1">{{ t('unlimited') }}</span> 
      <span class="lowercase">{{ t('time') }}</span>
    </UiText>
  </div>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps(['config'])
</script>