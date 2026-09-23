<template>
  <UCard v-if="!!source && source.length > 1" :ui="{ body: { base: 'min-h-[300px] max-h-[300px]'}}">
    <Line :data="data" :options="options" />
  </UCard>
</template>

<script setup>
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Line } from 'vue-chartjs'
import colors from '#tailwind-config/theme/colors'
const { t } = useI18n()
const props = defineProps(['source'])
const appConfig = useAppConfig()
const colorMode = useColorMode()

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const options = {
  responsive: true,
  maintainAspectRatio: false
}

const data = computed(() => {
  const primary = appConfig.ui.primary
  let labels = []
  let values = []

  const reverse = JSON.parse(JSON.stringify(props.source)).reverse()
  reverse.forEach(i => {
    labels.push(i.label)
    values.push(i.value)
  })

  return {
    labels: labels,
    datasets: [
      {
        label: t('statistical'),
        backgroundColor: colors[primary][colorMode.value === 'dark' ? 400 : 500],
        borderColor: colors[primary][colorMode.value === 'dark' ? 400 : 500],
        data: values
      }
    ]
  }
})
</script>