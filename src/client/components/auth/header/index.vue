<template>
  <UiFlex class="gap-1">
    <UPopover :ui="{wrapper: 'inline-flex'}" :popper="{ strategy: 'absolute', placement: 'bottom-end' }" v-model:open="open">
      <UiFlex class="gap-4">
        <UiText class="text-main text-xs md:text-sm">
          <span>Xin Chào</span>
          <span class="tqc-text-main block uppercase font-bold text-sm md:text-base">{{ authStore.profile?.username }}</span>
        </UiText>

        <UiIcon class="text-main size-4 md:size-5" name="mdi:chevron-down"></UiIcon>
      </UiFlex>
      

      <template #panel>
        <div class="bg-gray-1000 w-[220px] max-w-sreen p-2">
          <UiFlex
            v-for="(item, index) in menuUser" :key="index"
            class="MenuItem gap-2 text-gray-500 rounded-2xl"
            @click="item.click()"
          >
            <UiIcon class="MenuItem__Icon" :name="item.icon" size="6" />
            <UiText class="MenuItem__Text" size="sm" weight="semibold" color="gray">{{ item.label }}</UiText>
          </UiFlex>
        </div>
      </template>
    </UPopover>

    <UModal v-model="modal.view" :ui="{width: 'sm:max-w-[500px]'}">
      <DataUserInfo @close="modal.view = false" />
    </UModal>
    
    <UModal v-model="modal.history.giftcode" :ui="{width: 'sm:max-w-[900px]'}">
      <UiContent :title="t('menuGiftcodeHistory')" :sub="t('menuGiftcodeHistoryInfo')" class="bg-card rounded-2xl p-4" no-dot>
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.history.giftcode = false"></UButton>
        </template>

        <DataGiftcodeHistory/>
      </UiContent>
    </UModal>

    <UModal v-model="modal.history.payment" :ui="{width: 'sm:max-w-[900px]'}">
      <UiContent :title="t('menuPaymentHistory')" :sub="t('menuPaymentHistoryInfo')" class="bg-card rounded-2xl p-4" no-dot>
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.history.payment = false"></UButton>
        </template>

        <DataPaymentHistory />
      </UiContent>
    </UModal>

    <UModal v-model="modal.history.event" :ui="{width: 'sm:max-w-[900px]'}">
      <UiContent :title="t('menuEventHistory')" :sub="t('menuEventHistoryInfo')" class="bg-card rounded-2xl p-4" no-dot>
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.history.event = false"></UButton>
        </template>

        <DataEventHistory/>
      </UiContent>
    </UModal>

    <UModal v-model="modal.history.shop" :ui="{width: 'sm:max-w-[900px]'}">
      <UiContent :title="t('menuShopHistory')" :sub="t('menuShopHistoryInfo')" class="bg-card rounded-2xl p-4" no-dot>
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.history.shop = false"></UButton>
        </template>

        <DataShopHistory/>
      </UiContent>
    </UModal>

    <UModal v-model="modal.history.minigame" :ui="{width: 'sm:max-w-[900px]'}">
      <UiContent :title="t('menuMinigameHistory')" :sub="t('menuMinigameHistoryInfo')" class="bg-card rounded-2xl p-4" no-dot>
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="modal.history.minigame = false"></UButton>
        </template>

        <DataMinigameHistory/>
      </UiContent>
    </UModal>
  </UiFlex>
</template>

<script setup>
const { t } = useI18n()
const authStore = useAuthStore()

const open = ref(false)

const modal = ref({
  view: false,
  history: {
    payment: false,
    giftcode: false,
    event: false,
    shop: false,
    minigame: false
  }
})

const logout = async () => {
  await authStore.removeAuth()
}

const menuUser = computed(() => {
  const list = []

  if(!!authStore.profile.type > 0){
    list.push({
      label: t('menuManage'),
      icon: 'i-bx-shield-quarter',
      click: () => navigateTo('/admin')
    })
  }

  return [
    ...list,
    {
      label: t('menuProfile'),
      icon: 'i-bx-user',
      click: () => { open.value = false, modal.value.view = true }
    },
    {
      label: t('menuPaymentHistory'),
      icon: 'i-bx-credit-card',
      click: () => { open.value = false, modal.value.history.payment = true }
    },
    // {
    //   label: t('menuShopHistory'),
    //   icon: 'i-bx-cart',
    //   click: () => { open.value = false, modal.value.history.shop = true }
    // },
    // {
    //   label: t('menuGiftcodeHistory'),
    //   icon: 'i-bx-barcode',
    //   click: () => { open.value = false, modal.value.history.giftcode = true }
    // },
    // {
    //   label: t('menuEventHistory'),
    //   icon: 'i-mdi-event-star',
    //   click: () => { open.value = false, modal.value.history.event = true }
    // },
    // {
    //   label: t('menuMinigameHistory'),
    //   icon: 'i-bx-game',
    //   click: () => { open.value = false, modal.value.history.minigame = true }
    // },
    {
      label: t('signOut'),
      icon: 'i-mdi-power',
      click: () => logout()
    }
  ]
})
</script>