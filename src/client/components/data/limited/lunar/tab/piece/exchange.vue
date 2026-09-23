<template>
  <div class="w-full lunar-box rounded-2xl">
    <UTable :columns="columns" :rows="list">
      <template #pieces-data="{ row }">
        <UiFlex>
          <DataItem v-for="item in row.pieces" :key="item" :item="{
            item_name: `Mảnh ${item}`,
            item_image: `/images/limited/lunar/piece/${item}.png`,
            type: 'custom'
          }" :amount="1" :size="50"/>
        </UiFlex>
      </template>

      <template #gift-data="{ row }">
        <DataItemListMini :items="row.gift" :max="2" />
      </template>

      <template #active-data="{ row }">
        <UiFlex justify="end">
          <button 
            class="lunar-btn px-2 sm:px-4 py-1 rounded-2xl text-[0.65rem] sm:text-sm font-bold text-black" 
            @click="select(row)"
          >
            {{ t('exchange') }}
          </button>
        </UiFlex>
      </template>
    </UTable>

    <UModal v-model="modal" prevent-close>
      <UiContent :title="t('limitedLunarPieceExchange')" :sub="t('limitedLunarPieceExchangeSub')" class="Lunar rounded-2xl p-4">
        <UiIcon name="i-bx-x" size="8" class="lunar-text absolute top-2 right-2 cursor-pointer z-1" @click="modal = false" />

        <UForm :state="state" @submit="submit" >
          <UFormGroup :label="t('piece')" v-if="!!reward">
            <div class="lunar-box rounded-2xl p-4">
              <UiFlex>
                <DataItem v-for="item in reward.pieces" :key="item" :item="{
                  item_name: `Mảnh ${item}`,
                  item_image: `/images/limited/lunar/piece/${item}.png`,
                  type: 'custom'
                }" :amount="1" :size="50"/>
              </UiFlex>
            </div>
          </UFormGroup>

          <UFormGroup :label="t('server')">
            <SelectGameServer class="lunar-box rounded-2xl" v-model="state.server" />
          </UFormGroup>

          <UFormGroup :label="t('role')" v-if="state.server" >
            <SelectGameRole class="lunar-box rounded-2xl" v-model="state.role" :server="state.server" />
          </UFormGroup>

          <UFormGroup :label="t('award')" v-if="!!reward">
            <div class="lunar-box rounded-2xl p-4">
              <DataItemList :items="reward.gift" class="justify-center"/>
            </div>
          </UFormGroup>

          <UiFlex justify="end" class="gap-1">
            <UButton class="lunar-btn" @click="submit" :loading="loading" v-if="!!isActive">{{ t('confirm') }}</UButton>
            <UButton class="lunar-box" :disabled="loading" @click="modal = false">{{ t('close') }}</UButton>
          </UiFlex>
        </UForm>
      </UiContent>
    </UModal>
  </div>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps(['user'])
const emits = defineEmits(['close', 'exchange'])

const authStore = useAuthStore()
const configStore = useConfigStore()
const eventData = computed(() => configStore.eventLimited.lunar.data)

const list = computed(() => eventData.value.piece.reward.sort((a, b) => a.pieces.length - b.pieces.length))
const reward = ref(null)

const modal = ref(false)
const loading = ref(false)

const columns = [
  { key: 'pieces', label: t('piece') },
  { key: 'active', label: '' },
]

const state = ref({
  _id: null,
  pieces: null,
  server: null,
  role: null
})

const select = (item) => {
  if(!authStore.isLogin) return useNotify().error(t('errorAuthEmpty'))
  reward.value = item
  state.value._id = item._id
  state.value.pieces = item.pieces
  modal.value = true
}

const isActive = computed(() => {
  if(!state.value.server) return false
  if(!state.value.role) return false
  if(!state.value._id) return false
  if(!state.value.pieces) return false
  if(!reward.value) return false
  return true
})

const submit = async () => {
  try {
    loading.value = true
    await useAPI('limited/lunar/public/piece/exchange', state.value)

    loading.value = false
    modal.value = false
    emits('exchange')
  }
  catch (e) {
    loading.value = false
  }
}
</script>