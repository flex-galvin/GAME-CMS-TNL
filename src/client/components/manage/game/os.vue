<template>
  <UiFlex justify="center" class="gap-4 ">
    <div v-if="!!os.ram" class="relative" :style="{ width: `${size}px`, height: `${size}px` }">
      <svg class="h-full w-full" :viewBox="`0 0 ${actualSize} ${actualSize}`">
        <circle
          :cx="center"
          :cy="center"
          :r="radius"
          fill="none"
          stroke="currentColor"
          :stroke-width="actualStrokeWidth"
          class="text-black/40"
        />

        <circle
          :cx="center"
          :cy="center"
          :r="radius"
          fill="none"
          stroke="currentColor"
          :stroke-width="actualStrokeWidth"
          class="stroke-green-500"
          stroke-linecap="round"
          :stroke-dasharray="strokeDasharray.ram"
          transform="rotate(-90 25 25)"
        />
        <text
          :x="center"
          :y="center - 5"
          text-anchor="middle"
          dominant-baseline="middle"
          class="text-[6px] font-medium fill-green-500"
        >
          RAM
        </text>

        <text
          :x="center"
          :y="center + 5"
          text-anchor="middle"
          dominant-baseline="middle"
          class="text-[7px] font-medium fill-white"
        >
          {{ percent(os.ram?.use, os.ram?.total) }}%
        </text>
      </svg>

      <UiText size="sm" align="center">{{ `${toMoney(os.ram?.use)} / ${toMoney(os.ram?.total)}` }}</UiText>
    </div>

    <div v-if="!!os.disk" class="relative" :style="{ width: `${size}px`, height: `${size}px` }">
      <svg class="h-full w-full" :viewBox="`0 0 ${actualSize} ${actualSize}`">
        <circle
          :cx="center"
          :cy="center"
          :r="radius"
          fill="none"
          stroke="currentColor"
          :stroke-width="actualStrokeWidth"
          class="text-black/40"
        />

        <circle
          :cx="center"
          :cy="center"
          :r="radius"
          fill="none"
          stroke="currentColor"
          :stroke-width="actualStrokeWidth"
          class="stroke-orange-500"
          stroke-linecap="round"
          :stroke-dasharray="strokeDasharray.disk"
          transform="rotate(-90 25 25)"
        />
        <text
          :x="center"
          :y="center - 5"
          text-anchor="middle"
          dominant-baseline="middle"
          class="text-[6px] font-medium fill-orange-500"
        >
          DISK
        </text>
        <text
          :x="center"
          :y="center + 5"
          text-anchor="middle"
          dominant-baseline="middle"
          class="text-[7px] font-medium fill-white"
        >
          {{ percent(os.disk?.use, os.disk?.total) }}%
        </text>
      </svg>

      <UiText size="sm" align="center">{{ `${toMoney(os.disk?.use)} / ${toMoney(os.disk?.total)}` }}</UiText>
    </div>
  </UiFlex>
</template>

<script setup>
const { toMoney } = useMoney()
const os = ref({
  ram: null,
  disk: null
})

const size = 200
const actualSize = 50
const actualStrokeWidth = 5
const radius = actualSize / 2 - actualStrokeWidth
const circumference = 2 * Math.PI * radius
const center = actualSize / 2
const strokeDasharray = ref({
  ram: 0,
  disk: 0
})

const percent = (use, total) => {
  return Math.floor((use / total) * 100)
} 

const getOS = async () => {
  try {
    const get = await useAPI('game/manage/os')
    os.value.ram = get.ram
    os.value.disk = get.disk

    strokeDasharray.value.ram = `${(((get.ram.use / get.ram.total) * 100) / 100) * circumference} ${circumference}`
    strokeDasharray.value.disk = `${(((get.disk.use / get.disk.total) * 100) / 100) * circumference} ${circumference}`
  }
  catch(e) {
    return
  }
}

getOS()
</script>