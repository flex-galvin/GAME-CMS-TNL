<template>
  <UiFlex class="select-none overflow-hidden">
    <img :src="configStore.config.logo_long_image" class="h-[55px]" v-if="!!configStore.config.logo_long_image" />
    
    <UiText weight="bold" class="text-2xl md:text-3xl" v-else>
      <span class="text-main">{{nameArr.fristWord}}</span>
      <span class="text-white">{{nameArr.ensWord}}</span>
    </UiText>
  </UiFlex>
</template>

<script setup>
const configStore = useConfigStore()

const nameArr = computed(() => {
  const sentence = configStore.config.short_name
  if(!sentence) return { fristWord: "ENI", ensWord: "Studio" }

  const words = sentence.split(" ")
  if(words.length === 1) return { fristWord: words[0], ensWord: "" }

  const fristWord = words[0]
  const filteredWords = words.filter(word => word !== fristWord)
  const ensWord = filteredWords.join("")
  return { fristWord, ensWord }
})
</script>