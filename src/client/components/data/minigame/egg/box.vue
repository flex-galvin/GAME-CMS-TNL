<template>
  <div>
    <UiFlex v-for="(row, key) in eggs" :key="key" justify="center" class="gap-2">
      <UiFlex class="grow" justify="center">
        <UiFlex justify="center" v-for="(egg, i) in row" :key="i">
          <UiImg src="/images/icon/egg.png" w="1" h="1" class="Egg max-w-[60px] md:max-w-[70px] lg:max-w-[80px] cursor-pointer" v-if="!egg.history" @click="select(key, egg.index)" />
          <UiImg src="/images/icon/egg-open.png" w="1" h="1" class="max-w-[60px] md:max-w-[70px] lg:max-w-[80px]" v-if="!!egg.history" />
        </UiFlex>
      </UiFlex>
    </UiFlex>
  </div>
</template>

<script setup>
const { t } = useI18n()
const authStore = useAuthStore()
const props = defineProps(['source'])
const emits = defineEmits(['select'])

const format = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 }
const numberFormatRow = { 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six' }

const eggs = computed(() => {
  const data = {}
  for (const [key, list] of Object.entries(props.source)) {
    const cloneList = JSON.parse(JSON.stringify(list))
    
    if(!!format[key]){
      for(let i = 1; i <= format[key]; i++){
        const indexCheck = cloneList.findLastIndex(o => o.index == i)
        if(indexCheck < 0) cloneList.push({ index: i, history: null })
      }

      data[key] = cloneList.sort((a,b) => a.index - b.index)
    }
  }

  return data
})

const select = (row, index) => {
  if(!authStore.isLogin) return authStore.setModal(true)

  const rowNumber = format[row]
  if(rowNumber < 6){
    const rowDownNunber = rowNumber + 1
    const rowDown = props.source[numberFormatRow[rowDownNunber]]
    if(rowDown.length != rowDownNunber) return useNotify().error(t('errorMinigameEggOpenRowBelow'))
  }

  emits('select', { row, index })
}
</script>