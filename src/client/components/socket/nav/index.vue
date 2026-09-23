<template>
  <UiFlex type="col" class="bg-card-box rounded-2xl overflow-y-hidden">
    <UiFlex class="w-full px-2 py-3 gap-1 border-b border-black/10">
      <UChip 
        v-for="(item, index) in tabsChat" :key="index"
        :show="socketStore.chat[item.type].new > 0" :text="socketStore.chat[item.type].new >= 99 ? '99+' : socketStore.chat[item.type].new"
        color="rose"
      >
        <UButton color="gray" :icon="item.icon" class="grow justify-center"
          :class="{ 'bg-btn': socketStore.tab == item.key }"
          @click="select(item)"
        >
          <span>{{ item.title }}</span>
        </UButton>
      </UChip>

      <UChip 
        v-for="(item, index) in tabsNotify" :key="index"
        :show="socketStore.notify[item.type].new > 0" :text="socketStore.notify[item.type].new >= 99 ? '99+' : socketStore.notify[item.type].new"
        color="rose"
      >
        <UButton color="gray" :icon="item.icon" class="grow justify-center"
          :class="{ 'bg-btn': socketStore.tab == item.key }"
          @click="select(item)"
        >
          <span>{{ item.title }}</span>
        </UButton>
      </UChip>

      <!-- <SettingBtn class="ml-auto" /> -->
    </UiFlex>

    <Transition name="page" mode="out-in">
      <SocketChat class="w-full grow" v-if="socketStore.tab == 'chat-global'" />
      <LazySocketNotifyUser class="w-full grow" v-else-if="socketStore.tab == 'notify-single'" />
      <DataEmpty v-else class="w-full grow" />
    </Transition>
  </UiFlex>
</template>

<script setup>
const { t } = useI18n()

const props = defineProps({
  hasClose: Boolean
})
const emits = defineEmits(['close'])

const socketStore = useSocketStore()

const tabsChat = computed(() => [
  { title: t('world'), icon: 'i-bx-world', key: 'chat-global', type: 'global'},
])

const tabsNotify = computed(() => [
  { title: t('notice'), icon: 'i-bxs-bell', key: 'notify-single', type: 'single' },
])

const select = (item) => {
  socketStore.changeTab(item.key)
}
</script>