<template>
  <div>
    <Transition name="page" mode="out-in">
      <DataEmpty :loading="loading" :text="t('minigameMaintenance')" class="min-h-[300px]" v-if="!!loading || !items || (!!items && items.length == 0)" />

      <div v-else>
        <UiFlex justify="between" class="gap-2 mb-4">
          <UiTitle :name="t('minigameWheelTable')" icon="i-lucide-ferris-wheel" />
          <DataUserWheel v-if="!!authStore.isLogin" />
        </UiFlex>
        
        <UCard>
          <DataMinigameWheelBox 
            :items="items" 
            :gift-id="gift" 
            :spin="spin" 
            @done="doneSpin" 
            class="mb-6"
          />

          <UForm :state="state" :validate="validate" @submit="spinWheel" >
            <UFormGroup :label="t('server')" name="server" class="grow" v-if="!!authStore.isLogin">
              <SelectGameServer v-model="state.server" />
            </UFormGroup>
            
            <UFormGroup :label="t('role')" name="role" class="grow" v-if="!!state.server && !!authStore.isLogin">
              <SelectGameRole v-model="state.role" :server="state.server" />
            </UFormGroup>
            
            <UiFlex class="gap-1">
              <USelectMenu size="lg" class="mr-auto min-w-[120px]" v-model="state.times" :options="[1, 5, 10]">
                <template #label>{{ t('spin') }} x{{ state.times }}</template>
                <template #option="{ option }">{{ t('spin') }} x{{ option }}</template>
              </USelectMenu>

              <UButton type="submit" class="bg-btn" size="lg" :loading="spinning">{{ t('confirm') }}</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </div>
    </Transition>

    <UModal v-model="modal" prevent-close>
      <UiContent :title="t('minigameWheelAward')" :sub="t('minigameWheelAwardInfo')" class="bg-card p-4 rounded-2xl">
        <template #more>
          <UButton icon="i-bx-x" class="ml-auto" size="2xs" color="gray" square @click="renew"></UButton>
        </template>

        <DataItemList :items="gifts" justify="center" />
      </UiContent>
    </UModal>
  </div>
</template>

<script setup>
const { t } = useI18n()
const authStore = useAuthStore()
watch(() => authStore.isLogin, (val) => !!val && getWheel())

const props = defineProps({
  history: { type: Boolean, default: true }
})

const state = ref({
  server: null,
  role: null,
  times: 10
})

const loading = ref(true)
const spinning = ref(false)
const spin = ref(0)
const items = ref([])

const modal = ref(false)
const gifts = ref([])
const gift = ref(null)

const validate = (state) => {
  const errors = []
  if (!authStore.isLogin) return authStore.setModal(true)
  if (!state.server) errors.push({ path: 'server', message: t('errorSelectServer') })
  if (!state.role) errors.push({ path: 'role', message: t('errorSelectRole') })
  return errors
}

const doneSpin = async () => {
  spinning.value = false
  modal.value = true
}

const renew = () => {
  modal.value = false
  getWheel()
}

const spinWheel = async () => {
  try {
    if(!authStore.isLogin) return authStore.setModal(true)

    spinning.value = true
    const data = await useAPI('minigame/wheel/public/spin', state.value)

    gifts.value = data
    gift.value = data[data.length - 1]?._id
    spin.value++ 
  }
  catch {
    spinning.value = false
  }
}

const getWheel = async (frist) => {
  try {
    if(!!frist) loading.value = true
    const data = await useAPI('minigame/wheel/public/get')
    items.value = data

    if(!!frist) setTimeout(() => loading.value = false)
  }
  catch(e) {
    if(!frist) setTimeout(() => loading.value = false)
    items.value = []
  }
}

getWheel(true)
</script>