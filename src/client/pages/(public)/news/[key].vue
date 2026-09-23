<template>
  <div>
    <DataEmpty :loading="pending" :text="error || 'Bài viết không tồn tại'" class="min-h-[300px]" v-if="!!pending || !!error || !news"/>

    <div class="page-shell">
      <UiFlex type="col" items="center" justify="center" class="mb-10 gap-2">
        <h1 id="page-heading">{{ news.title }}</h1>
        <NuxtLink to="/" class="text-center text-sm text-yellow-800">Về Trang Chủ</NuxtLink>
      </UiFlex>

      <div class="page-paper">
        <DataEmpty class="h-[300px]" color="gray" v-if="!news.content || news.content == '<p></p>'"/>
        
        <UiEditorContent :content="news.content" v-else />
      </div>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
const runtimeConfig = useRuntimeConfig()
const configStore = useConfigStore()
const route = useRoute()
const news = ref(undefined)

useSeoMeta({
  title: () => `${news.value?.title || '...'} - ${t('menuNews')} - ${configStore.config.name}`,
  ogTitle: () => `${news.value?.title || '...'} - ${t('menuNews')} - ${configStore.config.name}`,
  description: () => news.value?.description,
  ogDescription: () => news.value?.description,
  ogImage: () => `${runtimeConfig.public.clientURL}${news.value?.og_image}`,
  ogImageAlt: () => news.value?.title || '...',
})

const { data, pending, error } = await useAsyncData('news-key', () => {
  return $fetch('/api/news/public/key', {
    method: 'POST',
    body: { key: route.params.key },
  })
})
watch(data, (val) => !!val && (news.value = val.result), { immediate: true })
</script>