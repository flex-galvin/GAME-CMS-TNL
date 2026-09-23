<template>
  <UiEffectOb>
    <UiFlex 
      class="
        bg-card-box
        rounded-2xl 
        gap-4 
        pr-4 pt-2
        overflow-hidden
        h-[120px] max:h-[120px]
      "
    >
      <img :src="`/images/icon/social.png`" class="absolute left-[-5px] bottom-[0] h-[120px] w-auto z-[1] beat-2-anim" />
      
      <div class="grow z-[2] pl-[120px]">
        <UiFlex type="col" class="mb-2" items="center">
          <UiText class="FTV uppercase" align="center">{{ t('support') }}</UiText>
        </UiFlex>

        <UiFlex class="gap-1.5" justify="center">
          <UiImg 
            class="max-w-[60px] max-h-[60px] cursor-pointer rounded-full hover:scale-95 ease-in duration-200"
            :src="`/images/social/facebook.png`"
            w="1" h="1"
            alt="facebook"
            @click="open(configStore.config.social.facebook)"
          ></UiImg>

          <UiImg 
            class="max-w-[60px] max-h-[60px] cursor-pointer rounded-full hover:scale-95 ease-in duration-200"
            :src="`/images/social/messenger.png`"
            w="1" h="1"
            alt="messenger"
            @click="open(configStore.config.social.messenger)"
          ></UiImg>

          <UiImg 
            class="max-w-[60px] max-h-[60px] cursor-pointer rounded-full hover:scale-95 ease-in duration-200"
            :src="`/images/social/zalo.png`"
            w="1" h="1"
            alt="zalo"
            @click="open(configStore.config.social.zalo)"
            v-if="configStore.config.social.zalo"
          ></UiImg>

          <UiImg 
            class="max-w-[60px] max-h-[60px] cursor-pointer rounded-full hover:scale-95 ease-in duration-200"
            :src="`/images/social/telegram.png`"
            w="1" h="1"
            alt="telegram"
            @click="open(configStore.config.social.telegram)"
            v-if="configStore.config.social.telegram"
          ></UiImg>

          <UiImg 
            class="max-w-[60px] max-h-[60px] cursor-pointer rounded-full hover:scale-95 ease-in duration-200"
            :src="`/images/social/tiktok.png`"
            w="1" h="1"
            alt="tiktok"
            @click="open(configStore.config.social.tiktok)"
            v-if="configStore.config.social.tiktok"
          ></UiImg>
        </UiFlex>
      </div> 
    </UiFlex>
  </UiEffectOb>
</template>

<script setup>
const { t } = useI18n()
const configStore = useConfigStore()

const open = (link) => {
  if(!link) return useNotify().error(t('emptySocialLink'))
  useTo().openNewTab(link)
}
</script>