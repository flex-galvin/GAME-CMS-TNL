<template>  
  <div class="tqc-container tqc-section-inner">
    <DataEmpty :loading="pending" :text="error || 'Bài viết không tồn tại'" class="min-h-[300px]" v-if="!!pending || !!error || !news"/>

    <div v-else>
      <div class="tqc-section-heading">
        <div>
          <div class="tqc-eyebrow">{{ news.description || 'Chiếu Chỉ Triều Đình - Bang Giao Thiên Hạ' }}</div>
          <h2 class="tqc-title" id="generals-title">{{ news.title }}</h2>
        </div>
      </div>

      <div class="tqc-section-content">
        <DataEmpty class="h-[300px]" color="gray" text="Không có nội dung" v-if="!news.content || news.content == '<p></p>'"/>
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