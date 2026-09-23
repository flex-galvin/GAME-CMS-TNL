<template>
  <PlayBtn :custom="true">
    <template #default="{ open }">
      <UiEffectOb @click="open">
        <UCard class="relative @container rounded-2xl overflow-hidden cursor-pointer" :ui="{ body: { padding: 'p-0 sm:p-0'} }" >
          <UiFlex items="stretch">
            <UiImg :src="config.og_image" w="16" h="9" class="@3xl:max-w-[55%] @3xl:min-w-[55%] @3xl:w-[55%] w-full" />

            <UiFlex type="col" justify="center" class="
              @3xl:py-4 py-3
              px-4
              @3xl:relative absolute bottom-0 
              w-full grow 
              backdrop-blur-3xl @3xl:backdrop-blur-none bg-black/50 @3xl:bg-black/10
            ">
              <UiText weight="bold" class="
                OPS line-clamp-1 @3xl:mb-1
                text-xl @2xl:text-2xl @3xl:text-3xl
                text-center
                text-gradient
              " >
                {{ config.name }}
              </UiText>
              
              <UiText class="
                line-clamp-2
                text-base @3xl:text-lg
                text-center
                text-gray-400
              ">
                {{ config.description }}
              </UiText>
            </UiFlex>
          </UiFlex>
        </UCard>
      </UiEffectOb>
    </template>
  </PlayBtn>
</template>

<script setup>
const configStore = useConfigStore()
const config = computed(() => configStore.config)
</script>