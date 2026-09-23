<template>
  <UiFlex type="col" class="gap-2 fixed right-2 bottom-2" justify="center">
    <UiImg 
      class="max-w-[60px] max-h-[60px] lg:max-w-[80px] lg:max-h-[80px] cursor-pointer rounded-full hover:scale-95 ease-in duration-200"
      :src="`/images/tqc/facebook.png`"
      w="1" h="1"
      alt="facebook"
      @click="open(configStore.config.social.facebook)"
    ></UiImg>

    <UiImg 
      class="max-w-[60px] max-h-[60px] lg:max-w-[80px] lg:max-h-[80px] cursor-pointer rounded-full hover:scale-95 ease-in duration-200"
      :src="`/images/tqc/messenger.png`"
      w="1" h="1"
      alt="messenger"
      @click="open(configStore.config.social.messenger)"
    ></UiImg>

    <UiImg 
      class="max-w-[60px] max-h-[60px] lg:max-w-[80px] lg:max-h-[80px] cursor-pointer rounded-full hover:scale-95 ease-in duration-200"
      :src="`/images/tqc/telegram.png`"
      w="1" h="1"
      alt="telegram"
      @click="open(configStore.config.social.telegram)"
    ></UiImg>
  </UiFlex>
</template>

<script setup>
const { t } = useI18n()
const configStore = useConfigStore()

const open = (link) => {
  if(!link) return useNotify().error(t('emptySocialLink'))
  useTo().openNewTab(link)
}
</script>