<template>
  <div class="tqc-container tqc-section-inner">
    <div class="tqc-section-heading">
        <div>
          <div class="tqc-eyebrow">Chiếu Chỉ Triều Đình</div>
          <p class="tqc-text tqc-text--compact">Cập nhật các tin tức mới nhất.</p>
        </div>
    </div>

    <div class="tqc-section-content grid grid-cols-12 gap-6">
      <NuxtLink 
        v-for="news in list" 
        class="col-span-12 md:col-span-6 cursor-pointer" 
        :to="`/news/${news.key}`"
      >
        <UiFlex class="gap-4" justify="between">
          <UiText class="text-xs sm:text-sm italic">{{ useDayJs().displayTime(news.createdAt) }}</UiText>
          <div class="tqc-button-hover py-2 px-4 text-xs lg:text-sm 2xl:text-base">
            {{ news.category?.nane || 'NEWS' }}
          </div>
        </UiFlex>
        <UiText class="tqc-text-main text-base md:text-lg">{{ news.title }}</UiText>
      </NuxtLink>
    </div>
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