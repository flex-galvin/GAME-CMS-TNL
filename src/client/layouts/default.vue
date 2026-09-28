<template>
  <main class="theme-tqc">
    <LayoutPublicSelectionHero />
    <LayoutPublicSelectionMenu />

    <section class="tqc-generals" id="page-main" aria-labelledby="generals-title">
      <slot></slot>
    </section>

    <LayoutPublicSelectionFooter />

    <DataNotice />
    <MainLimited />
   </main>
</template>