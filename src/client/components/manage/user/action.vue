<template>
  <UiFlex class="inline-flex" v-if="user">
    <UDropdown :items="actions(user)">
      <UButton color="gray" icon="i-bxs-pencil" />
    </UDropdown>

    <!-- Modal Edit Auth-->
    <UModal v-model="modal.editAuth" preventClose>
      <UForm :state="stateEditAuth" @submit="editAuthAction" class="bg-card rounded-2xl p-4">
        <UFormGroup :label="t('email')">
          <UInput v-model="stateEditAuth.email" disabled />
        </UFormGroup>

        <UFormGroup :label="t('phone')">
          <UInput v-model="stateEditAuth.phone" disabled />
        </UFormGroup>

        <UFormGroup :label="t('password')">
          <UInput v-model="stateEditAuth.password" type="password" />
        </UFormGroup>

        <UFormGroup :label="t('lock')">
          <SelectAuthBlock v-model="stateEditAuth.block" />
        </UFormGroup>

        <UFormGroup :label="t('userService')">
          <SelectAuthType v-model="stateEditAuth.type" />
        </UFormGroup>

        <UiFlex justify="end"  class="gap-1">
          <UButton color="yellow" type="submit" :loading="loading">{{ t('edit') }}</UButton>
          <UButton color="gray" @click="modal.editAuth = false" :disabled="loading">{{ t('close') }}</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit Currency-->
    <UModal v-model="modal.editCurrency" preventClose>
      <UForm :state="stateEditCurrency" @submit="editCurrencyAction" class="bg-card rounded-2xl p-4">
        <UFormGroup :label="t('coin')">
          <UInput v-model="stateEditCurrency.plus.coin" type="number" v-if="stateEditCurrency.type == 'plus'" />
          <UInput v-model="stateEditCurrency.origin.coin" type="number" v-if="stateEditCurrency.type == 'origin'" />
        </UFormGroup>

        <UFormGroup :label="t('wheel')">
          <UInput v-model="stateEditCurrency.plus.wheel" type="number" v-if="stateEditCurrency.type == 'plus'" />
          <UInput v-model="stateEditCurrency.origin.wheel" type="number" v-if="stateEditCurrency.type == 'origin'"/>
        </UFormGroup>

        <UFormGroup :label="t('diamond')">
          <UInput v-model="stateEditCurrency.plus.diamond" type="number" v-if="stateEditCurrency.type == 'plus'" />
          <UInput v-model="stateEditCurrency.origin.diamond" type="number" v-if="stateEditCurrency.type == 'origin'"/>
        </UFormGroup>

        <UFormGroup :label="t('reason')">
          <UTextarea v-model="stateEditCurrency.reason" />
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton color="yellow" type="submit" :loading="loading">
            {{ stateEditCurrency.type == 'plus' ? t('add') : t('edit') }}
          </UButton>
          <UButton color="gray" @click="modal.editCurrency = false" :disabled="loading">{{ t('close') }}</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit Pay-->
    <UModal v-model="modal.editPay" preventClose>
      <UForm :state="stateEditPay" @submit="editPayAction" class="bg-card rounded-2xl p-4" v-if="stateEditPay.pay">
        <UFormGroup :label="t('day')">
          <UInput v-model="stateEditPay.pay.day.money" type="number" />
        </UFormGroup>

        <UFormGroup :label="t('month')">
          <UInput v-model="stateEditPay.pay.month.money" type="number" />
        </UFormGroup>

        <UFormGroup :label="t('total')">
          <UInput v-model="stateEditPay.pay.total.money" type="number" />
        </UFormGroup>

        <UFormGroup :label="t('reason')">
          <UTextarea v-model="stateEditPay.reason" />
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton color="yellow" type="submit" :loading="loading">{{ t('edit') }}</UButton>
          <UButton color="gray" @click="modal.editPay = false" :disabled="loading">{{ t('close') }}</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit Pay Musty-->
    <UModal v-model="modal.editPaymusty" preventClose>
      <UForm :state="stateEditPaymusty" @submit="editPaymustyAction" class="bg-card rounded-2xl p-4" v-if="stateEditPaymusty.paymusty">
        <UFormGroup :label="t('paymustyAdd')">
          <UiFlex class="gap-1">
            <UInput type="number" size="md" class="grow" v-model="paymusty"></UInput>
            <UButton class="bg-btn" size="md" @click="addPayMusty">{{ t('add') }}</UButton>
          </UiFlex>
        </UFormGroup>

        <UFormGroup :label="t('paymustyNow')" v-if="stateEditPaymusty.paymusty.length > 0">
          <UiFlex wrap class="gap-1">
            <UBadge class="bg-card-box" size="lg" v-for="(money, index) in stateEditPaymusty.paymusty">
              {{ useMoney().toMoney(money) }}{{ t("moneyAcronym") }}
              <UiIcon name="i-bx-x" size="5" color="red" class="cursor-pointer" @click="stateEditPaymusty.paymusty.splice(index, 1)" />
            </UBadge>
          </UiFlex>
        </UFormGroup>

        <UFormGroup :label="t('reason')">
          <UTextarea v-model="stateEditPaymusty.reason" />
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton color="yellow" type="submit" :loading="loading">{{ t('edit') }}</UButton>
          <UButton color="gray" @click="modal.editPaymusty = false" :disabled="loading">{{ t('close') }}</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit Pay Days-->
    <UModal v-model="modal.editPaydays" preventClose>
      <UForm :state="stateEditPaydays" @submit="editPaydaysAction" class="bg-card rounded-2xl p-4" v-if="stateEditPaydays.paydays">
        <UFormGroup :label="t('paydaysCount')">
          <UInput v-model="stateEditPaydays.paydays.day" type="number" />
        </UFormGroup>

        <UFormGroup :label="t('paydaysReceive')">
          <UInput v-model="stateEditPaydays.paydays.receive" type="number" />
        </UFormGroup>

        <UFormGroup :label="t('reason')">
          <UTextarea v-model="stateEditPaydays.reason" />
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton color="yellow" type="submit" :loading="loading">{{ t('edit') }}</UButton>
          <UButton color="gray" @click="modal.editPaydays = false" :disabled="loading">{{ t('close') }}</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit Spend-->
    <UModal v-model="modal.editSpend" preventClose>
      <UForm :state="stateEditSpend" @submit="editSpendAction" class="bg-card rounded-2xl p-4" v-if="stateEditSpend.spend">
        <UFormGroup :label="t('day')">
          <UInput v-model="stateEditSpend.spend.day.coin" type="number" />
        </UFormGroup>

        <UFormGroup :label="t('month')">
          <UInput v-model="stateEditSpend.spend.month.coin" type="number" />
        </UFormGroup>

        <UFormGroup :label="t('total')">
          <UInput v-model="stateEditSpend.spend.total.coin" type="number" />
        </UFormGroup>

        <UFormGroup :label="t('reason')">
          <UTextarea v-model="stateEditSpend.reason" />
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton color="yellow" type="submit" :loading="loading">{{ t('edit') }}</UButton>
          <UButton color="gray" @click="modal.editSpend = false" :disabled="loading">{{ t('close') }}</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Edit Login-->
    <UModal v-model="modal.editLogin" preventClose>
      <UForm :state="stateEditLogin" @submit="editLoginAction" class="bg-card rounded-2xl p-4" v-if="stateEditLogin.login">
        <UFormGroup :label="t('month')">
          <UInput v-model="stateEditLogin.login.month" type="number" />
        </UFormGroup>

        <UFormGroup :label="t('total')">
          <UInput v-model="stateEditLogin.login.total" type="number" />
        </UFormGroup>

        <UiFlex justify="end" class="gap-1">
          <UButton color="yellow" type="submit" :loading="loading">{{ t('edit') }}</UButton>
          <UButton color="gray" @click="modal.editLogin = false" :disabled="loading">{{ t('close') }}</UButton>
        </UiFlex>
      </UForm>
    </UModal>

    <!-- Modal Send Item-->
    <UModal v-model="modal.sendItem" preventClose :ui="{width: 'sm:max-w-[800px]'}">
      <ManageGameSend class="bg-card rounded-2xl p-4" :user="stateSendItem.user" @close="modal.sendItem = false" />
    </UModal>
  </UiFlex>
</template>

<script setup>
const { t } = useI18n()
const props = defineProps(['user'])
const emits = defineEmits(['done'])

// Modal
const modal = ref({
  editAuth: false,
  editCurrency: false,
  editPay: false,
  editPaymusty: false,
  editPaydays: false,
  editSpend: false,
  editLogin: false,
  sendItem: false,
})

// Loading
const loading = ref(false)

// State
const stateEditAuth = ref({
  _id: null,
  email: null,
  phone: null,
  password: null,
  type: null,
  block: null
})

const stateEditCurrency = ref({
  type: null,
  plus: {
    coin: 0,
    wheel: 0,
    diamond: 0,
  },
  origin: {
    coin: null,
    wheel: null,
    diamond: null,
  },
  reason: null
})

const stateEditPay = ref({
  _id: null,
  pay: null,
  reason: null
})

const stateEditPaymusty = ref({
  _id: null,
  paymusty: null,
  reason: null
})

const stateEditPaydays = ref({
  _id: null,
  paydays: null,
  reason: null
})

const stateEditSpend = ref({
  _id: null,
  spend: null,
  reason: null
})

const stateEditLogin = ref({
  _id: null,
  login: null
})

const stateSendItem = ref({
  user: null
})

// Pay Musty
const paymusty = ref()
const addPayMusty = () => {
  if(!paymusty.value) return useNotify().error(t('errorInputEmpty'))
  if(!stateEditPaymusty.value.paymusty) return useNotify().error(t('errorObjectNotFound'))
  if(stateEditPaymusty.value.paymusty.includes(paymusty.value)) return useNotify().error(t('errorInputValueHas'))
  stateEditPaymusty.value.paymusty.push(paymusty.value)
  paymusty.value = null
}

// Actions
const actions = (row) => [
  [{
    label: t('editInfo'),
    icon: 'i-bx-pencil',
    click: () => {
      Object.keys(stateEditAuth.value).forEach(key => stateEditAuth.value[key] = row[key])
      modal.value.editAuth = true
    }
  }],[{
    label: t('addCurrency'),
    icon: 'i-bx-coin-stack',
    click: () => {
      stateEditCurrency.value._id = row._id
      stateEditCurrency.value.type = 'plus'
      modal.value.editCurrency = true
    }
  },{
    label: t('editCurrency'),
    icon: 'i-bx-coin',
    click: () => {
      Object.keys(stateEditCurrency.value.origin).forEach(key => stateEditCurrency.value.origin[key] = row.currency[key])
      stateEditCurrency.value._id = row._id
      stateEditCurrency.value.type = 'origin'
      modal.value.editCurrency = true
    }
  }],[{
    label: t('editPay'),
    icon: 'i-bx-wallet',
    click: () => {
      stateEditPay.value.pay = JSON.parse(JSON.stringify(row.pay))
      stateEditPay.value._id = row._id
      modal.value.editPay = true
    }
  },{
    label: t('editPaymusty'),
    icon: 'i-fluent-money-hand-20-filled',
    click: () => {
      stateEditPaymusty.value.paymusty = JSON.parse(JSON.stringify(row.paymusty))
      stateEditPaymusty.value._id = row._id
      modal.value.editPaymusty = true
    }
  },{
    label: t('editPaydays'),
    icon: 'i-game-icons-take-my-money',
    click: () => {
      stateEditPaydays.value.paydays = JSON.parse(JSON.stringify(row.paydays))
      stateEditPaydays.value._id = row._id
      modal.value.editPaydays = true
    }
  },{
    label:  t('editSpend'),
    icon: 'i-bx-wallet-alt',
    click: () => {
      stateEditSpend.value.spend = JSON.parse(JSON.stringify(row.spend))
      stateEditSpend.value._id = row._id
      modal.value.editSpend = true
    }
  },{
    label:  t('editLogin'),
    icon: 'i-bx-calendar',
    click: () => {
      stateEditLogin.value.login = JSON.parse(JSON.stringify(row.login))
      stateEditLogin.value._id = row._id
      modal.value.editLogin = true
    }
  }],
  [{
    label: t('sendMail'),
    icon: 'i-bx-mail-send',
    click: () => {
      stateSendItem.value.user = row._id
      modal.value.sendItem = true
    }
  }]
]

watch(() => modal.value.editCurrency, (val) => !val && (stateEditCurrency.value = {
  type: null,
  plus: {
    coin: 0,
    wheel: 0,
    diamond: 0,
  },
  origin: {
    coin: null,
    wheel: null,
    diamond: null,
  },
  reason: null
}))
watch(() => modal.value.editPay, (val) => !val && (stateEditPay.value.reason = null))
watch(() => modal.value.editSpend, (val) => !val && (stateEditSpend.value.reason = null))

// Function
const editAuthAction = async () => {
  try {
    loading.value = true
    await useAPI('user/manage/edit/auth', stateEditAuth.value)

    loading.value = false
    modal.value.editAuth = false
    emits('done')
  }
  catch (e) {
    loading.value = false
  }
}

const editCurrencyAction = async () => {
  try {
    loading.value = true
    await useAPI('user/manage/edit/currency', stateEditCurrency.value)

    loading.value = false
    modal.value.editCurrency = false
    emits('done')
  }
  catch (e) {
    loading.value = false
  }
}

const editPayAction = async () => {
  try {
    loading.value = true
    await useAPI('user/manage/edit/pay', stateEditPay.value)

    loading.value = false
    modal.value.editPay = false
    emits('done')
  }
  catch (e) {
    loading.value = false
  }
}

const editPaymustyAction = async () => {
  try {
    loading.value = true
    await useAPI('user/manage/edit/paymusty', stateEditPaymusty.value)

    loading.value = false
    modal.value.editPaymusty = false
    emits('done')
  }
  catch (e) {
    loading.value = false
  }
}

const editPaydaysAction = async () => {
  try {
    loading.value = true
    await useAPI('user/manage/edit/paydays', stateEditPaydays.value)

    loading.value = false
    modal.value.editPaydays = false
    emits('done')
  }
  catch (e) {
    loading.value = false
  }
}

const editSpendAction = async () => {
  try {
    loading.value = true
    await useAPI('user/manage/edit/spend', stateEditSpend.value)

    loading.value = false
    modal.value.editSpend = false
    emits('done')
  }
  catch (e) {
    loading.value = false
  }
}

const editLoginAction = async () => {
  try {
    loading.value = true
    await useAPI('user/manage/edit/login', stateEditLogin.value)

    loading.value = false
    modal.value.editLogin = false
    emits('done')
  }
  catch (e) {
    loading.value = false
  }
}
</script>