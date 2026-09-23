<template>
  <UiContent :title="t('setting')" :sub="t('settingInfo')" class="bg-card rounded-2xl p-4">
    <template #more>
      <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="emits('close')"></UButton>
    </template>

    <UiFlex class="mb-2 overflow-hidden">
      <div v-for="item in locales" class="w-1/2 px-0.5">
        <UButton 
          @click="setLocale(item.code)"
          color="gray" 
          class="w-full justify-center gap-0.5 py-4"
          :class="{
            'bg-btn': item.code == locale
          }"
        >{{ item.name }}</UButton>
      </div>
    </UiFlex>    

    <UiFlex justify="between">
      <UiText weight="semibold" size="sm">{{ t('settingSocketNotifyRunning') }}</UiText>

      <USelectMenu 
        v-model="notifyRunning" 
        :options="[
          { label: t('settingSocketNotifyRunningAll'), value: 'all' },
          { label: t('settingSocketNotifyRunningOnlyHome'), value: 'only-home' },
        ]" 
        option-attribute="label" 
        value-attribute="value" 
        class="w-[170px]"
        @change="socketStore.setNotifyRunningEnable" 
      />
    </UiFlex>
  </UiContent>
</template>

<script setup>
const { t, locales, setLocale, locale } = useI18n()
const emits = defineEmits(['close'])

const socketStore = useSocketStore()
const notifyRunning = ref(socketStore.notifyRunningEnable)
</script>