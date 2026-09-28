<template>
  <section class="tqc-community" id="cong-dong" aria-labelledby="community-title">
    <div class="tqc-container py-6 lg:py-12">
      <div>
          <div class="tqc-eyebrow">Khám phá tính năng</div>
          <p class="tqc-text tqc-text--compact">Đa dạng tính năng bổ trợ cho quá trình tung hoành thiên hạ.</p>
      </div>

      <div class="grid grid-cols-12 gap-2.5">
        <NuxtLink class="tqc-card-link col-span-6 lg:col-span-3 overflow-hidden" to="/promo" aria-label="Truy cập trang Khuyến mãi của game">
          <img src="/images/tqc/promo.png" width="1254" height="1254" alt="" loading="lazy" :class="{
            'jump-anim': limitedEnable?.time?.end
          }" >
          <strong class="tqc-text-label">
            HẠN THỜI
            <span v-if="limitedEnable?.time?.end" >
              (<UiCountdown :time="limitedEnable.time.end"  />)
            </span>
          </strong>
          <span class="tqc-text-meta">Khuyến mãi, sự kiện giới hạn</span>
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
</template>

<script setup>
const { t } = useI18n()
const authStore = useAuthStore()
const configStore = useConfigStore()

const limitedEnable = computed(() => {
  const now = Date.now()

  const list = Object.values(configStore.eventLimited || {})
    .filter(item => item.enable && item.data)
    .flatMap(item => {
      const data = Array.isArray(item.data)
        ? item.data
        : [item.data]

      return data.filter(child => {
        if (!child?.time?.start || !child?.time?.end) {
          return false
        }

        const end = new Date(child.time.end).getTime()

        return end > now
      })
    })

  return list.sort(
    (a, b) =>
      new Date(a.time.end).getTime() -
      new Date(b.time.end).getTime()
  )[0] ?? null
})
</script>