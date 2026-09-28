<template>
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