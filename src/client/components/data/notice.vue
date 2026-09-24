<template>
  <UModal v-model="modal" prevent-close :ui="{width: 'sm:max-w-[600px]'}">
    <UiContent 
      :title="notice.title || t('notice')" 
      :sub="notice.description || t('noticeFromSystem')" 
      class="bg-card p-4 rounded-2xl"
    >
      <template #more>
        <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal = false"></UButton>
      </template>

      <div class="bg-card-box p-4 rounded-2xl">
        <UiEditorContent v-html="notice.content" />
      </div>

      <UiFlex class="gap-2 mt-3" justify="end">
        <UToggle v-model="hide" />
        <UiText color="gray" size="sm">{{ t('notShowAgain') }}</UiText>
      </UiFlex>
    </UiContent>
  </UModal>
</template>

<script setup>
const { t } = useI18n()
const configStore = useConfigStore()
const runtimeConfig = useRuntimeConfig()
const modal = ref(false)
const hide = ref(false)
const noticeVersion = useCookie('notice-version', runtimeConfig.public.cookieConfig)

const isInTime = (startStr, endStr)  => {
  function toMinutes(hhmm) {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  }

  if(!startStr || !endStr) return false

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();

  const start = toMinutes(startStr);
  const end = toMinutes(endStr);

  if (start < end) {
    return nowMinutes >= start && nowMinutes < end;
  } 
  else {
    return nowMinutes >= start || nowMinutes < end;
  }
} 

const notice = computed(() => configStore.config.notice)

const active = computed(() => {
  if(!configStore.config.notice) return false
  if(!configStore.config.notice.content) return false
  if(configStore.config.notice.content == '<p></p>') return false
  if(!configStore.config.notice.time) return false
  if(!configStore.config.notice.time.start) return false
  if(!configStore.config.notice.time.end) return false

  const check = isInTime(configStore.config.notice.time.start, configStore.config.notice.time.end)
  if(!check) return false

  if(!!noticeVersion.value){
    if(noticeVersion.value == configStore.config.notice.version) return false
    else return true
  }
  else return true
})

watch(() => active.value, (val) => {
  if(!val) modal.value = false
  else {
    noticeVersion.value = null
    hide.value = false
    modal.value = true
  }
})
watch(() => hide.value, (val) => {
  if(!!val) noticeVersion.value = configStore.config.notice.version
  else noticeVersion.value = null
})

onMounted(() => {
  if(!!active.value){
    noticeVersion.value = null
    hide.value = false
    modal.value = true
  }
})
</script>