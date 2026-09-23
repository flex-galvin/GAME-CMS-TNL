<template>
  <div class="tqc-container tqc-section-inner">
    <div class="tqc-section-heading">
        <div>
          <div class="tqc-eyebrow">Chiếu Chỉ Triều Đình</div>
          <h2 class="tqc-title" id="generals-title">Tin Tức</h2>
        </div>
    </div>

    <UiFlex type="col" class="tqc-section-content divide-y divide-[#c9a6671f] gap-6">
      <NuxtLink 
        v-for="news in list" 
        class="w-full cursor-pointer" 
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