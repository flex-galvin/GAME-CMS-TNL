<template>
  <UiFlex type="col" class="grow w-full overflow-hidden">
    <!-- Online -->
    <UiFlex class="w-full gap-2 p-2 border-b border-black/10">
      <UiDot color="green" size="2" class="animate-ping mx-2" />
      <UiText size="sm" weight="semibold">{{ t('online') }}</UiText>
      <UiText size="sm" weight="bold" color="green">{{ socketStore.online }}</UiText>

      <UButton icon="i-bxs-group" class="ml-auto" size="lg" variant="ghost" color="white" :padded="false" :loading="!!loading.list" />
    </UiFlex>

    <!-- Loading Start -->
    <DataEmpty class="grow w-full" :loading="loading.start" v-if="!!loading.start || listFormat.length == 0" />

    <!-- Messenger -->
    <div class="HideScroll grow w-full gap-4 overflow-y-auto px-2" ref="box">
      <UiFlex v-for="chat in listFormat" :key="chat._id" class="w-full my-4">
        <UiFlex class="w-full space-x-2" items="start" v-if="chat.type != 'notify'">
          <UAvatar :src="chat.user.avatar" size="sm" />
          
          <div class="text-left">
            <UiFlex class="mb-1 gap-1">
              <UBadge size="xs" variant="soft" :color="typeFormat[chat.user.type].color" class="capitalize">{{ hideName(chat.user.username) }}</UBadge>
            </UiFlex>

            <div class="inline-block bg-card-box py-3 px-4 rounded-r-2xl rounded-bl-2xl text-left mb-2" :style="{ wordBreak: 'break-word' }">
              <UiText size="sm">{{ chat.text || '...' }}</UiText>
            </div>

            <UiFlex>
              <UiText color="gray"  class="leading-none mx-2 text-[0.7rem]" mini>{{ useDayJs().fromTime(chat.createdAt, null, true) }}</UiText>
            </UiFlex>
          </div>
        </UiFlex>

        <UiFlex justify="center" v-if="chat.type == 'notify'" class="w-full">
          <UiText size="xs" v-html="chat.text"></UiText>
        </UiFlex>
      </UiFlex>
    </div>

    <!--Input-->
    <div class="w-full border-t border-black/10 p-2 mt-auto">
      <UForm :state="state" @submit="send">
        <UiFlex>
          <UInput 
            v-model="state.text" 
            :disabled="!!loading.send || !authStore.isLogin"
            :loading="!!loading.send" 
            :ui="{ 
              padding: { md: 'pr-10' },
            }"
            color="gray"
            variant="outline"
            :placeholder="!!authStore.isLogin ? t('socketChatInput') : t('socketChatInputNoAuth')" 
            class="w-full" 
            size="md"
            id="InputChatGlobal"
            ref="input"
          >
          </UInput>

          <UiIcon 
            name="i-basil-send-solid" 
            color="primary" 
            class="cursor-pointer absolute right-4" 
            size="6" 
            :disabled="!!loading.send" 
            @click="send"
            v-if="!!authStore.isLogin"
          ></UiIcon>
        </UiFlex>
      </UForm>
    </div>
  </UiFlex>
</template>

<script setup>
const { t } = useI18n()
const { $socket } = useNuxtApp()
const authStore = useAuthStore()
const socketStore = useSocketStore()

const box = ref()
const input = ref()

const loading = ref({
  start: true,
  list: false,
  send: false
})

const list = ref([])
const page = ref({
  size: 20,
  skip: 0
})

const state = ref({
  text: null
})

const typeFormat = {
  0: { label: 'MEMBER', color: 'gray' },
  1: { label: 'SMOD', color: 'green' },
  2: { label: 'DEV', color: 'cyan' },
  3: { label: 'ADMIN', color: 'red' },
  99: { label: 'ROBOT', color: 'orange' }
}

const listFormat = computed(() => {
  return list.value.sort((a,b) => {
    return new Date(a.createdAt) - new Date(b.createdAt);
  })
})

const hideName = (str) => {
  if (str == 'bot') return 'BOT'
  if (str.length <= 3) return '*'.repeat(str.length);
  return str.slice(0, 3 * -1) + '***';
}

const toFocus = async () => {
  await nextTick()
  input.value.$refs.input.focus()
}

const toBottom = async () => {
  await nextTick()
  box.value.scrollTo({ top: box.value.scrollHeight, behavior: 'smooth' })
}

const toScroll = async (event) => {
  if (event.target.scrollTop === 0) {
    if(!!loading.value.list) return

    const scrollHeightBefore = box.value.scrollHeight
    await getLazy()

    const scrollHeightAfter = box.value.scrollHeight
    box.value.scrollTop = scrollHeightAfter - scrollHeightBefore
    box.value.removeEventListener('scroll', toScroll)
    box.value.addEventListener('scroll', toScroll)
  }
}

const send = async () => {
  try {
    if(!authStore.isLogin) return false
    if(!!loading.value.send) return useNotify().error(t('errorSocketChatSendWaiting'))
    if(!state.value.text) return useNotify().error(t('errorSocketChatSendInputEmpty'))
    if(state.value.text.length > 100) return useNotify().error(t('errorSocketChatSendInputLength'))

    loading.value.send = true
    $socket.emit('chat-global-send', state.value)

    state.value.text = null
    loading.value.send = false
    toFocus()
  }
  catch (e){
    loading.value.send = false
  }
}

const getLazy = async () => {
  try {
    if(!!loading.value.start) return

    loading.value.list = true
    const data = await useAPI('socket/public/chat/list', page.value)

    list.value = list.value.concat(data)
    page.value.skip = list.value.length
    
    setTimeout(() => loading.value.list = false, 500) 
  }
  catch {
    loading.value.list = false
  }
}

const getStart = async () => {
  try {
    loading.value.start = true
    const data = await useAPI('socket/public/chat/list', page.value)
    list.value = data
    page.value.skip = list.value.length
    
    loading.value.start = false 
    toBottom()
    box.value.addEventListener('scroll', toScroll)
  }
  catch {
    loading.value.start = false
  }
}

watch(() => socketStore.chat.global.push.update, () => {
  const data = socketStore.chat.global.push.data

  list.value.push(data)
  page.value.skip = list.value.length
  toBottom()
})

onMounted(() => {
  setTimeout(getStart, 1000)
  socketStore.changeChatData('global', { new: 0 })
})
</script>