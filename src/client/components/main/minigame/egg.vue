<template>
  <Transition name="page" mode="out-in">
    <DataEmpty :loading="loading" :text="t('minigameMaintenance')" class="min-h-[300px]" v-if="!!loading || !(!!source && !!config)" />

    <div v-else>
      <UiFlex justify="between" class="gap-2 mb-4">
        <UiTitle :name="t('minigameEggTower')" icon="i-game-icons-egg-clutch" />
        <UButton @click="modal.reset = true" v-if="!!authStore.isLogin" icon="i-bx-reset" size="lg" color="gray">{{ t('minigameEggPlayAgain') }}</UButton>
      </UiFlex>

      <UCard>
        <DataMinigameEggBox :source="source" @select="select" />
      </UCard>

      <UModal v-model="modal.dam" prevent-close>
        <UiContent :title="t('menuMinigameEgg')" :sub="t('minigameEggOpenInfo')" class="bg-card rounded-2xl p-4" no-dot>
          <template #more>
            <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square :disabled="!!damming" @click="modal.dam = false"></UButton>
          </template>

          <UForm :state="state" :validate="validate" @submit="dam" v-if="!!authStore.isLogin">
            <UFormGroup :label="t('position')" name="map" v-if="!!state.row && !!state.index">
              <UInput :model-value="`Hàng ${format[state.row]} - ${state.index}`" readonly />
            </UFormGroup>

            <UFormGroup :label="t('price')" name="price" v-if="!!state.price">
              <template #hint>
                <DataUserCoin size="xs" />
              </template>
              
              <UInput :model-value="`${useMoney().toMoney(state.price)} Xu`" readonly />
            </UFormGroup>

            <UFormGroup :label="t('server')" name="server">
              <SelectGameServer v-model="state.server" />
            </UFormGroup>
            
            <UFormGroup :label="t('role')" name="role" v-if="!!state.server">
              <SelectGameRole v-model="state.role" :server="state.server" />
            </UFormGroup>

            <UiFlex justify="end" class="gap-1">
              <UButton type="submit" class="bg-btn" :loading="damming">{{ t('confirm') }}</UButton>
              <UButton color="gray" :disabled="!!damming" @click="modal.dam = false">{{ t('cancel') }}</UButton>
            </UiFlex>
          </UForm>
        </UiContent>
      </UModal>

      <UModal v-model="modal.reset" preventClose>
        <UiContent :title="t('minigameEggPlayAgain')" class="bg-card rounded-2xl p-4" no-dot>
          <UAlert :title="t('attention')" icon="i-bxs-info-circle" color="rose" variant="soft">
            <template #description>
              {{ t('minigameEggResetInfo') }}
            </template>
          </UAlert>

          <UiFlex class="mt-4" justify="end">
            <UButton @click="reset" :loading="reseting" color="rose">{{ t('confirm') }}</UButton>
            <UButton color="gray" @click="modal.reset = false" :disabled="!!reseting" class="ml-1">{{ t('close') }}</UButton>
          </UiFlex>
        </UiContent>
      </UModal>

      <UModal v-model="modal.gift" :ui="{ width: 'max-w-[220px] sm:max-w-[220px]' }">
        <UiContent :title="t('award')" class="bg-card rounded-2xl p-4" no-dot v-if="!!gift">
          <UiFlex type="col" v-if="!!gift.item">
            <DataItemImage :src="gift.item.item_image" :type="gift.item.type" size="120" />

            <UiFlex type="col" class="w-full mt-3">
              <UiText weight="bold" align="center" size="lg" class="max-w-[90%] leading-[1.5rem] mb-2">
                {{ gift.item.name || gift.item.item_name }}
              </UiText>
              <UBadge size="md" class="bg-card-box px-4 md:px-6 max-w-full" v-if="!!gift.amount && gift.amount > 0">x {{ useMoney().toMoney(gift.amount) }}</UBadge>
            </UiFlex>
          </UiFlex>
        </UiContent>
      </UModal>
    </div>
  </Transition>
</template>

<script setup>
const { t } = useI18n()
const authStore = useAuthStore()

const props = defineProps({
  history: { type: Boolean, default: true }
})

const modal = ref({
  dam: false,
  reset: false,
  gift: false
})

const state = ref({
  row: null,
  index: null,
  server: null,
  role: null,
  price: null
})

const format = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6 }

const config = ref(null)
const source = ref(null)

const loading = ref(true)
const damming = ref(false)
const reseting = ref(false)
const reload = ref(0)
const gift = ref()

const validate = (state) => {
  const errors = []
  if (!state.server) errors.push({ path: 'server', message: t('errorSelectServer') })
  if (!state.role) errors.push({ path: 'role', message: t('errorSelectRole') })
  if (!!authStore.isLogin && (authStore.profile.currency.coin < state.price)) errors.push({ path: 'price', message: t('errorInsufficientBalance') })
  if (!state.row || !state.index) errors.push({ path: 'map', message: t('errorMinigameEggPosition') })
  return errors
}

const select = ({ row, index }) => {
  state.value.row = row
  state.value.index = index
  state.value.price = !!config.value[row] ? config.value[row]['price'] : 0
  modal.value.dam = true
}

const reset = async () => {
  try {
    reseting.value = true
    const data = await useAPI('minigame/egg/public/reset')

    reseting.value = false
    modal.value.reset = false
    getEgg()
  }
  catch {
    reseting.value = false
  }
}

const dam = async () => {
  try {
    if(!authStore.isLogin) return authStore.setModal(true)

    damming.value = true
    const data = await useAPI('minigame/egg/public/damming', state.value)

    gift.value = data
    damming.value = false
    modal.value.dam = false
    reload.value++
    getEgg()

    await nextTick()
    modal.value.gift = true
  }
  catch {
    damming.value = false
  }
}

const getEgg = async () => {
  try {
    loading.value = true

    const data = await useAPI('minigame/egg/public/get')
    source.value = data.source
    config.value = data.config
    setTimeout(() => loading.value = false)
  }
  catch(e){
    setTimeout(() => loading.value = false)
  }
}

getEgg()
watch(() => authStore.isLogin, () => getEgg())
</script>