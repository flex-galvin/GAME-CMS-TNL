<template>
  <NuxtLink :to="`/news/${news.key}`" class="hover:scale-95 ease-in duration-200">
    <UiEffectOb>
      <UCard class="overflow-hidden cursor-pointer" :ui="{
        divide: '',
        shadow: 'shadow',
        header: {
          padding: 'p-0 p-0 sm:p-0',
        },
        body: {
          padding: 'px-3 py-3 sm:p-4',
        },
        footer: {
          base: 'border-none',
          padding: 'px-3 py-0 pb-3 sm:px-4',
        }
      }">
        <template #header>
          <UiImg :src="news.og_image" w="16" h="9" class="bg-card-box" />
        </template>

        <template #default>
          <UiText weight="bold" class="
            mb-0.5 line-clamp-2 
            text-gray-300 
            text-gradient-hover 
            text-xs sm:text-sm md:text-lg 
            min-h-[35px] sm:min-h-[43px] md:min-h-[60px]
          ">
            {{ news.title }}
          </UiText>
          
          <UiText color="gray" class="line-clamp-1 text-[0.6rem] sm:text-xs md:text-sm">
            {{ news.description }}
          </UiText>

          <UiFlex justify="between" class="mt-2 gap-2">
            <UBadge :color="news.category?.color || 'primary'">
              <UiText mini class="max-w-[70px] sm:max-w-full">{{ news.category?.name || '...' }}</UiText>
            </UBadge>

            <UiText color="gray" weight="semibold" class="text-[0.6rem] sm:text-xs" align="end">
              {{ useDayJs().displayTimeNoYear(news.createdAt) }}
            </UiText>
          </UiFlex>
        </template>
      </UCard>
    </UiEffectOb>
  </NuxtLink>
</template>

<script setup>
const props = defineProps(['news'])
</script>