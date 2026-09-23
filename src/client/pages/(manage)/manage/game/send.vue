<template>
  <UiContent :title="t('menuManageGameSendItem')" :sub="t('menuManageGameSendItemInfo')" class="max-w-4xl mx-auto">
    <UCard>
      <UForm @submit="onSubmit" :validate="validate" :state="state">
        <UiFlex class="gap-1">
          <UFormGroup :label="t('title')" name="title" class="grow">
            <UInput v-model="state.title" />
          </UFormGroup>

          <UFormGroup :label="t('content')" name="content" class="grow">
            <UInput v-model="state.content" />
          </UFormGroup>
        </UiFlex>

        <UFormGroup :label="t('reason')" name="reason">
          <UInput v-model="state.reason" />
        </UFormGroup>

        <UFormGroup :label="t('role')" name="roles">
          <SelectGameRoles v-model="state.roles" />
        </UFormGroup>

        <UFormGroup :label="t('item')" name="items">
          <SelectItemList v-model="state.items" :types="['coin', 'wheel', 'game_item']" />
        </UFormGroup>

        <UiFlex class="gap-2" justify="end" wrap>
          <UButton color="yellow" type="submit" :loading="loading" class="ml-auto">{{ t('confirm') }}</UButton>
        </UiFlex>
      </UForm>
    </UCard>

    <UModal v-model="modal">
      <UiFlex type="col" justify="center" class="bg-card rounded-2xl p-4">
        <DotLottieVue autoplay loop src="/animation/process.lottie" class="h-[200px]" v-if="!!loading"/>
        <DotLottieVue autoplay src="/animation/success.lottie" class="h-[200px]" v-else/>

        <UiFlex class="gap-2 w-full mb-2 mt-6">
          <UiText size="xs" color="gray">{{ progressText }} [<span class="text-cyan-400">{{progressPercent}}%</span>]</UiText>
          <UiText size="xs" color="gray">|</UiText>
          <UiText size="xs" color="gray">Thành công: <span class="text-green-400">{{doneCount}}</span></UiText>
          <UiText size="xs" color="gray">|</UiText>
          <UiText size="xs" color="gray">Lỗi: <span class="text-red-400">{{failedCount}}</span></UiText>
        </UiFlex>

        <div class="HideScroll bg-card-box w-full max-h-40 overflow-y-auto rounded-2xl py-2 px-3 text-xs" ref="boxLog">
          <div v-for="(l, idx) in logs" :key="idx">
            <UiText :color="l.color">{{ l.text }}</UiText>
          </div>
        </div>

        <UiFlex justify="end" class="w-full mt-2" v-if="!loading">
          <UButton color="gray" @click="modal = false">{{ t('close') }}</UButton>
        </UiFlex>
      </UiFlex>
    </UModal>
  </UiContent>
</template>

<script setup>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
const { $socket } = useNuxtApp()
const { t } = useI18n()
const authStore = useAuthStore()

const loading = ref(false)
const modal = ref(false)
const boxLog = ref()

// State And Validate
const state = ref({
  title: t('manageGameSendItemTitleDefault'),
  content: t('manageGameSendItemContentDefault'),
  reason: authStore.profile.type > 1 ? t('manageGameSendItemReasonDefault') : null,
  roles: [],
  items: []
})

const validate = (s) => {
  const errors = []
  if (!s.reason) errors.push({ path: 'reason', message: t('errorInputEmpty') })
  if (s.roles.length < 1) errors.push({ path: 'roles', message: t('errorInputEmpty') })
  // if (s.items.length < 1) errors.push({ path: 'items', message: t('errorInputEmpty') })
  return errors
}

// Progress State
const total = ref(0)
const doneCount = ref(0)
const failedCount = ref(0)
const logs = ref([])

// Process Text and Percent
const progressPercent = computed(() => {
  if (total.value === 0) return 0
  return Math.round(((doneCount.value + failedCount.value) / total.value) * 100)
})
const progressText = computed(() => `Đã xử lý ${doneCount.value + failedCount.value}/${total.value}`)

// Add Log
const writeLog = async (data) => {
  logs.value.push(data)
  await nextTick()
  boxLog.value.scrollTo({ top: boxLog.value.scrollHeight, behavior: 'smooth' })
}

// Submit
const onSubmit = async () => {
  if (!!loading.value) return
  const rolesToSend = state.value.roles.slice()

  // Open modal + start
  modal.value = true
  loading.value = true
  doneCount.value = 0
  failedCount.value = 0
  total.value = rolesToSend.length
  
  try {
    loading.value = true
    await useAPI('game/manage/send/multiple', state.value)

    loading.value = false
  } 
  finally {
    loading.value = false
  }
}

onMounted(() => {
  $socket.on('manage-send-multiple-success', (sendInfo) => {
    const idx = state.value.roles.findLastIndex(i => i.user._id == sendInfo.user._id && i.role.role_id == sendInfo.role.role_id && i.server.server_id == sendInfo.server.server_id)
    if(idx > -1) {
      const data = state.value.roles[idx]
      writeLog({ type: 'info', color: 'gray', text: `✔️ Gửi thư thành công cho tài khoản [${data.user.username}] nhân vật [${data.role.role_name}], máy chủ [${data.server.server_name}]` })
      state.value.roles.splice(idx, 1)
      doneCount.value++
    }
  })
  
  $socket.on('manage-send-multiple-error', (sendInfo) => {
    const idx = state.value.roles.findLastIndex(i => i.user._id == sendInfo.user._id && i.role.role_id == sendInfo.role.role_id && i.server.server_id == sendInfo.server.server_id)
    if(idx > -1) {
      const data = state.value.roles[idx]
      writeLog({ type: 'error', color: 'red', text: `❌ Gửi thư thất bại cho tài khoản [${data.user.username}] nhân vật [${data.role.role_name}], máy chủ [${data.server.server_name}] với lý do [${sendInfo.reason}]` })
      failedCount.value++
    }
  })      
})
</script>

