<template>
  <UModal v-model="modal" prevent-close>
    <UiFlex type="col" justify="center" class="bg-card rounded-2xl p-6">
      <UiIcon name="i-bxs-cloud-download" class="h-[7rem] w-[7rem] sm:h-[8rem] sm:w-[8rem] md:h-[10rem] md:w-[10rem] text-[#8bffac] bounce-anim" />
      <UiText weight="bold" align="center" class="mb-2 FTV text-[#8bffac] text-2xl sm:text-3xl">{{ t('updateNow') }}</UiText>
      <UiText color="gray" align="center" class="mb-4 text-sm sm:text-lg">{{ notice }}</UiText>
      <UButton color="gray" size="md" @click="reload">{{ t('reloadAfterSeconds', { a: num }) }}</UButton>
    </UiFlex>
  </UModal>
</template>

<script setup>
const { t } = useI18n()
const { $socket } = useNuxtApp()

const modal = ref(false)
const notice = ref(null)
const num = ref(5)
const anim = ref(null)

const reload = () => {
  if(anim.value) clearInterval(anim.value), anim.value = null
  useTo().navigateToSSL('/')
  location.reload()
}

onMounted(() => {
  $socket.on('notice-reload', (data) => {
    notice.value = data
    modal.value = true

    num.value = 5
    anim.value = setInterval(() => {
      num.value = num.value - 1
      if(num.value == 0) reload()
    }, 1000)
  })
})
</script>