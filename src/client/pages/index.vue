<template>
  <div class="page-shell">
    <h1 id="page-heading mb-10">TIN TỨC</h1>

    <UiFlex class="page-paper gap-4" type="col">
      <NuxtLink 
        v-for="news in list" 
        class="w-full cursor-pointer" 
        :to="`/news/${news.key}`"
      >
        <UiFlex class="gap-4" justify="between">
          <UiText class="text-xs sm:text-sm">{{ useDayJs().displayTime(news.createdAt) }}</UiText>
          <div class="page-category">
            {{ news.category?.nane || 'NEWS' }}
          </div>
        </UiFlex>
        <UiText class="page-item text-base md:text-lg">{{ news.title }}</UiText>
      </NuxtLink>
    </UiFlex>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'home'
})

const list = ref([])

const getLatest = async () => {
  try {
    const latest = await useAPI('news/public/latest')
    list.value = latest
  }
  catch (e) {
    list.value = []
  }
}

getLatest()
</script>