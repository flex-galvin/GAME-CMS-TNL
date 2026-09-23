<template>
  <div>
    <!-- Match -->
    <UiFlex class="mb-2 gap-1">
      <UForm :state="page" @submit="getList" class="grow lg:grow-0">
        <UInput v-model="page.search" :placeholder="t('search')" icon="i-bx-search" size="md" />
      </UForm>

      <UDropdown :items="menuList" class="ml-auto">
        <UButton icon="i-mynaui-filter" color="gray" size="md">{{ t('filter') }}</UButton>
      </UDropdown>
    </UiFlex>

    <SelectShopCategory v-model="page.category" type="item" class="mb-2" :options="[{ _id: null, label: t('default') }]" list-btn />

    <div class="overflow-hidden" :class="{ 'HideScroll max-h-[45vh] overflow-y-auto p-0.5' : !!scroll }">
      <!-- Loading-->
      <DataEmpty v-if="!!loading || list.length == 0" :loading="loading" :text="t('shopNoItem')" class="min-h-[300px]"></DataEmpty>
      
      <!-- Main-->
      <div class="@container grid grid-cols-12 gap-2" v-else>
        <DataShopItem
          class="@4xl:col-span-3 @xl:col-span-4 col-span-6" 
          v-for="item in list" :key="item._id"
          :item="item"
          :config="config"
          @click="buyItem(item)"
        />
      </div>
    </div>

    <!-- Pagination -->
    <UiFlex justify="center" class="mt-2" v-if="page.total > list.length">
      <UPagination :max="5" :page-count="page.size" :total="page.total" v-model="page.current" />
    </UiFlex>

    <!-- Buy -->
    <UModal v-model="modal.buy" prevent-close v-if="authStore.isLogin">
      <DataShopItemBuy :item="itemSelect" @close="modal.buy = false" class="p-4"/>
    </UModal>
  </div>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps({
  scroll: Boolean
})
const authStore = useAuthStore()

const config = ref({
  maintenance: true,
  discount: {
    number: null,
    expired: null
  }
})
const list = ref([])

const loading = ref(true)
const modal = ref({
  buy: false
})

const page = ref({
  size: 12,
  current: 1,
  sort: {
    direction: 'desc',
    column: 'price'
  },
  search: undefined,
  category: undefined,
  total: 0,
  types: ['game_item'],
})
watch(() => page.value.sort, () => getList())
watch(() => page.value.current, () => getList())
watch(() => page.value.types, () => getList())
watch(() => page.value.category, () => getList())
watch(() => page.value.search, (val) => (!val && getList()))

const itemSelect = ref(undefined)
watch(() => modal.value.buy, (val) => (!val && (itemSelect.value = undefined)))

const menuList = computed(() => [
  [{
    label: t('filterUpdate'),
    icon: 'i-bx-sort', 
    click: () => page.value.sort = { direction: 'desc', column: 'updatedAt' }
  }],[{
    label: t('filterPriceDesc'),
    icon: 'i-bx-sort-down', 
    click: () => page.value.sort = { direction: 'desc', column: 'price' }
  },{ 
    label: t('filterPriceAsc'),
    icon: 'i-bx-sort-up', 
    click: () => page.value.sort = { direction: 'asc', column: 'price' }
  }]
])

const buyItem = (item) => {
  if(!authStore.isLogin) return authStore.setModal(true)

  itemSelect.value = item
  modal.value.buy = true
}

const getList = async () => {
  try {
    loading.value = true

    const configData = await useAPI('shop/config/public/get')
    config.value = Object.assign(config.value, configData)

    const listData = await useAPI('shop/item/public/list', page.value)
    page.value.total = listData.total
    list.value = listData.list

    setTimeout(() => loading.value = false)
  }
  catch (e) {
    list.value = []
    setTimeout(() => loading.value = false)
  }
}

getList()
</script>