<template>
  <NuxtLink :to="game.url" target="_blank" >
    <UCard class="overflow-hidden cursor-pointer hover:scale-95 ease-in duration-200" :ui="{
      divide: '',
      shadow: 'shadow',
      header: {
        padding: 'p-0 p-0 sm:p-0',
      },
      body: {
        padding: 'px-3 py-3 sm:p-4',
      },
      footer: {
        base: 'border-none',
        padding: 'px-3 py-0 pb-3 sm:px-4',
      }
    }">
      <template #header>
        <UiImg :src="game.image" w="16" h="9" class="bg-card-box" />
      </template>

      <template #default>
        <UiText weight="bold" class="mb-0.5 line-clamp-1 text-xs sm:text-sm md:text-lg text-gray-300 text-gradient-hover">
          {{ game.name }}
        </UiText>
        
        <UiText color="gray" class="line-clamp-1 text-[0.6rem] sm:text-xs md:text-sm">
          {{ game.description }}
        </UiText>

        <UiFlex justify="between" class="mt-2">
          <UBadge color="primary">{{ game.code || 'CODE' }}</UBadge>

          <UiText color="gray" weight="semibold" class="text-[0.6rem] sm:text-xs" align="end">
            {{ game.company || 'ZZG' }}
          </UiText>
        </UiFlex>
      </template>
    </UCard>
  </NuxtLink>
</template>

<script setup>
const props = defineProps(['game'])
</script>