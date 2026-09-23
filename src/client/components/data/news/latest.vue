<template>
  <div class="@container" v-if="list.length > 0">
    <UiFlex justify="between" class="gap-2 mb-2" wrap>
      <NuxtLink to="/news">
        <UiTitle :name="t('newsLatest')" icon="i-bx-news" />
      </NuxtLink>
    </UiFlex>

    <div class="grid grid-cols-12">
      <DataNewsBox 
        v-for="(item, index) in list" 
        :key="index" 
        class="@2xl:col-span-4 col-span-6 p-0.5"
        :news="item"
      ></DataNewsBox>
    </div>
  </div>
</template>

<script setup>
const { t } = useI18n()
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