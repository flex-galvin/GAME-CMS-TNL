<template>
  <header class="
    sticky top-0 z-50 
    bg-card-box backdrop-blur-2xl
    px-4
  ">
    <UiFlex class="h-[var(--header-size)] max-h-[var(--header-size)] gap-1">
      <UButton color="gray" icon="i-mdi-home" size="lg" square @click="navigateTo('/')" />
      <LayoutManageNavSlide />

      <UiFlex class="ml-auto">
        <AuthHeader />
      </UiFlex>
    </UiFlex>
  </header>
</template>