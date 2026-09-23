<template>
  <UDropdown :items="actions(user._id)" v-if="!!user">
    <UButton color="gray" icon="i-bx-reset" :loading="loading" />
  </UDropdown>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps(['user'])
const emits = defineEmits(['done'])

const loading = ref(false)
const actions = (_id) => [
  [{ label: t('resetCurrency'), click: () => resetAction('currency', _id)}],
  [
    { label: t('resetPayDay'), click: () => resetAction('pay.day', _id)},
    { label: t('resetPayMonth'), click: () => resetAction('pay.month', _id)},
    { label: t('resetPayTotal'), click: () => resetAction('pay.total', _id)},
  ],
  [
    { label: t('resetPaymusty'), click: () => resetAction('paymusty', _id)},
    { label: t('resetPaydays'), click: () => resetAction('paydays', _id)},
  ],
  [
    { label: t('resetSpendDay'), click: () => resetAction('spend.day', _id)},
    { label: t('resetSpendMonth'), click: () => resetAction('spend.month', _id)},
    { label: t('resetSpendTotal'), click: () => resetAction('spend.total', _id)},
  ],
  [
    { label: t('resetLoginMonth'), click: () => resetAction('login.month', _id)},
    { label: t('resetLoginTotal'), click: () => resetAction('login.total', _id)},
  ],
  [ { label: t('resetEgg'), click: () => resetAction('egg', _id)}],
]

const resetAction = async (type, _id) => {
  try {
    loading.value = true
    await useAPI('user/manage/reset', { type, user: _id })

    loading.value = false
    emits('done')
  }
  catch (e) {
    loading.value = false
  }
}

</script>