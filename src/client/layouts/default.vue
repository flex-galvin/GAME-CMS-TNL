<template>
  <div>
    <main class="hero" aria-label="Tam Quốc">
      <LayoutPublicHeader class="absolute w-full z-50 top-0 left-0" /> 

      <div class="artwork" aria-hidden="true">
        <img class="warrior warrior-left" src="/images/tqc/p-index-left.png" alt="">
        <img class="warrior warrior-right" src="/images/tqc/p-index-right.png" alt="">
        <img class="warrior warrior-center" src="/images/tqc/p-index-center.png" alt="">
        <div class="artwork-mask"></div>
      </div>

      <div class="account-actions" v-if="!authStore.isLogin">
        <button class="account-button bg-btn uppercase" @click="authStore.setModal(true, 0)">Đăng Nhập</button>
        <button class="account-button bg-btn-2 uppercase" @click="authStore.setModal(true, 1)">Đăng Ký</button>
      </div>

      <div class="account-actions" v-else>
        <PlayBtn class="account-button bg-btn-2" :custom="true">
          <template #default="{ open }">
            <UiText @click="open" class="uppercase">
              {{ configStore.config.game.mobile ? t('downloadBtn') : t('playBtn')}}
            </UiText>
          </template>
        </PlayBtn>

        <NuxtLink to="/nap-tien" class="account-button bg-btn uppercase">NẠP XU</NuxtLink>
      </div>
    </main>

    <section class="page-section">
      <slot></slot>
    </section>
  </div>
</template>

<script setup>
const { t } = useI18n()
const authStore = useAuthStore()
const configStore = useConfigStore()
</script>