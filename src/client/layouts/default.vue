<template>
  <main class="theme-tqc">
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

    <section class="tqc-community" id="cong-dong" aria-labelledby="community-title">
      <div class="tqc-container py-6 lg:py-12">
        <div>
            <div class="tqc-eyebrow">Khám phá tính năng</div>
            <p class="tqc-text tqc-text--compact">Đa dạng tính năng bổ trợ cho quá trình tung hoành thiên hạ.</p>
        </div>

        <div class="grid grid-cols-12 gap-2.5">
          <NuxtLink class="tqc-card-link col-span-6 lg:col-span-3" to="/promo" aria-label="Truy cập trang Khuyến mãi của game">
            <img src="/images/tqc/promo.png" width="1254" height="1254" alt="" loading="lazy">
            <strong class="tqc-text-label">HẠN THỜI</strong>
            <span class="tqc-text-meta">Khuyến mãi, sự kiện giới hạn ↗</span>
          </NuxtLink>
          
          <NuxtLink class="tqc-card-link col-span-6 lg:col-span-3" to="/giftcode" aria-label="Truy cập trang Giftcode của game">
            <img src="/images/tqc/giftcode.png" width="1254" height="1254" alt="" loading="lazy">
            <strong class="tqc-text-label">GIFTCODE</strong>
            <span class="tqc-text-meta">Nhập mã nhận quà ↗</span>
          </NuxtLink>
          
          <NuxtLink class="tqc-card-link col-span-6 lg:col-span-3" to="/event" aria-label="Truy cập trang Sự kiện của game">
            <img src="/images/tqc/event.png" width="1254" height="1254" alt="" loading="lazy">
            <strong class="tqc-text-label">SỰ KIỆN</strong>
            <span class="tqc-text-meta">Tích nạp, tích tiêu... ↗</span>
          </NuxtLink>

          <NuxtLink class="tqc-card-link col-span-6 lg:col-span-3" to="/shop" aria-label="Truy cập trang Cửa hàng của game">
            <img src="/images/tqc/shop.png" width="1254" height="1254" alt="" loading="lazy">
            <strong class="tqc-text-label">CỬA HÀNG</strong>
            <span class="tqc-text-meta">Mua vật phẩm ↗</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <section class="tqc-generals" id="page-main" aria-labelledby="generals-title">
      <slot></slot>
    </section>

    <section class="tqc-community" id="cong-dong" aria-labelledby="community-title">
      <div class="tqc-container tqc-community-inner">
        <div>
            <div class="tqc-eyebrow">Tứ hải giai huynh đệ</div>
            <p class="tqc-text tqc-text--compact">Kết giao đồng đội, cùng bàn chiến thuật và theo dõi tin tức từ cộng
              đồng {{ configStore.config.name }}.</p>
        </div>

        <div class="tqc-card-grid">
          <div class="tqc-card-link" @click="open(configStore.config.social.facebook)" aria-label="Truy cập Facebook của game">
            <img src="/images/tqc/facebook.png" width="1254" height="1254" alt="" loading="lazy">
            <strong class="tqc-text-label">Facebook</strong>
            <span class="tqc-text-meta">THEO DÕI ↗</span>
          </div>
          
          <NuxtLink class="tqc-card-link" @click="open(configStore.config.social.messenger)" aria-label="Truy cập Messenger của game">
            <img src="/images/tqc/messenger.png" width="1254" height="1254" alt="" loading="lazy">
            <strong class="tqc-text-label">Messenger</strong>
            <span class="tqc-text-meta">KẾT NỐI ↗</span>
          </NuxtLink>
          
          <NuxtLink class="tqc-card-link" @click="open(configStore.config.social.telegram)" aria-label="Truy cập Telegram của game">
            <img src="/images/tqc/telegram.png" width="1254" height="1254" alt="" loading="lazy">
            <strong class="tqc-text-label">Telegram</strong>
            <span class="tqc-text-meta">GIA NHẬP ↗</span>
          </NuxtLink>
        </div>
      </div>
    </section>

    <DataNotice />
    <MainLimited />
   </main>
</template>

<script setup>
const { t } = useI18n()
const authStore = useAuthStore()
const configStore = useConfigStore()

const open = (link) => {
  if(!link) return useNotify().error(t('emptySocialLink'))
  useTo().openNewTab(link)
}
</script>