<template>
  <section class="tqc-hero pt-10" id="trang-chu" aria-labelledby="hero-title">
    <LayoutPublicHeader class="absolute tqc-container z-50 top-0 left-1/2 -translate-x-1/2" /> 

    <div class="tqc-hero-bg" aria-hidden="true"></div>
    <div class="tqc-embers" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>
    <div class="tqc-hero-inner tqc-container">
      <div class="tqc-hero-copy">
        <div class="tqc-eyebrow">Quần hùng hội tụ · Bá nghiệp khai sinh</div>
        <h1 class="tqc-title tqc-title--display" id="hero-title">{{ configStore.config.name }}</h1>
        <p class="tqc-text tqc-text--lead">{{ configStore.config.description }}</p>

        <div class="tqc-button-group" v-if="!authStore.isLogin">
          <div href="#dang-ky" class="tqc-button tqc-button--primary" @click="authStore.setModal(true, 0)">Tham Gia Ngay</div>
          <div href="#dang-nhap" class="tqc-button" @click="authStore.setModal(true, 1)">Đăng Ký</div>
        </div>

        <div class="tqc-button-group" v-else>
          <PlayBtn class="tqc-button tqc-button--primary" :custom="true">
            <template #default="{ open }">
              <UiText @click="open" class="uppercase">
                {{ configStore.config.game.mobile ? t('downloadBtn') : t('playBtn')}}
              </UiText>
            </template>
          </PlayBtn>

          <NuxtLink to="/payment" class="tqc-button">NẠP XU</NuxtLink>
        </div>

        <div class="tqc-text-note"><span aria-hidden="true"></span>Trí định thiên hạ · Nghĩa kết anh hùng</div>
      </div>

      <div class="tqc-hero-art" aria-hidden="true">
        <img class="tqc-warrior-left" src="/images/tqc/p-index-left.png" alt="" width="1135" height="957">
        <img class="tqc-warrior-right" src="/images/tqc/p-index-right.png" alt="" width="1025" height="829">
        <img class="tqc-warrior-center" src="/images/tqc/p-index-center.png" alt="" width="966" height="1074">
      </div>
    </div>
  </section>
</template>

<script setup>
const { t } = useI18n()
const authStore = useAuthStore()
const configStore = useConfigStore()
</script>