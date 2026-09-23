<template>
  <UiFlex>
    <UButton color="gray" icon="i-bx-menu-alt-left" size="lg" square @click="open = true" />

    <USlideover v-model="open" side="left" :ui="{
      width: 'w-screen max-w-xs'
    }">
      <UCard 
        class="flex flex-col flex-1 w-full" 
        :ui="{ 
          base: 'overflow-y-auto',
          body: { base: 'grow overflow-y-auto bg-card' },
          ring: '', 
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
          rounded: 'rounded-none'
        }"
      >
        <LayoutManageNav @to="open = false"/>
      </UCard>
    </USlideover>
  </UiFlex>
</template>

<script setup>
const open = ref(false)
</script>