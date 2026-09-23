<template>
  <div class="h-full min-h-full">
    <LayoutManageHeader />

    <div class="
      grid grid-cols-12 gap-0 
      min-h-[calc(100%-var(--header-size))]
    ">
      <div class="
        bg-card-box backdrop-blur-2xl
        2xl:col-span-2 xl:col-span-3 col-span-12
        xl:block hidden
        xl:sticky xl:top-[var(--header-size)]
        xl:max-h-[calc(100vh-var(--header-size))] overflow-y-auto
        HideScroll
        p-4 z-[5]
      ">
        <LayoutManageNav />
      </div>
      
      <div class="
        2xl:col-span-10 xl:col-span-9 col-span-12
      ">
        <main class="p-4 max-w-[1700px] mx-auto w-full overflow-x-hidden min-h-full">
          <slot></slot>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
useSeoMeta({
  title: () => `Manage Pannel`,
  robots: 'none'
})

const authStore = useAuthStore()
watch(() => authStore.isLogin, (val) => !val && useTo().navigateToSSL('/'))
</script>