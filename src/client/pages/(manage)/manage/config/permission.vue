<template>
  <UiContent :title="t('menuManageConfigPermission')" :sub="t('menuManageConfigPermissionInfo')" class="max-w-3xl mx-auto">
    <UAccordion
      color="primary"
      variant="soft"
      size="md"
      :items="menu"
      v-if="!load"
    >
      <template #default="{ item, open }">
        <UButton size="md" class="bg-card-box mb-1">
          <UiText class="text-white" :class="{
            '!text-gray-400': !open,
            '!text-primary-400': !!open
          }">{{ item.label }}</UiText>
        </UButton>
      </template>

      <template #config>
        <UCard>
          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">{{ t('update') }}</UiText>
            <SelectPermission v-model="state.config.update" />
          </UiFlex>

          <UiFlex justify="between">
            <UiText weight="semibold">{{ t('actionAdmin') }}</UiText>
            <SelectPermission v-model="state.config.action" />
          </UiFlex>
        </UCard>
      </template>

      <template #news>
        <UCard>
          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">{{ t('add') }}</UiText>
            <SelectPermission v-model="state.news.add" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">{{ t('edit') }}</UiText>
            <SelectPermission v-model="state.news.edit" />
          </UiFlex>

          <UiFlex justify="between">
            <UiText weight="semibold">{{ t('del') }}</UiText>
            <SelectPermission v-model="state.news.del" />
          </UiFlex>
        </UCard>
      </template>

      <template #ads>
        <UCard>
          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">{{ t('add') }}</UiText>
            <SelectPermission v-model="state.ads.add" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">{{ t('edit') }}</UiText>
            <SelectPermission v-model="state.ads.edit" />
          </UiFlex>

          <UiFlex justify="between">
            <UiText weight="semibold">{{ t('del') }}</UiText>
            <SelectPermission v-model="state.ads.del" />
          </UiFlex>
        </UCard>
      </template>

      <template #ipuser>
        <UCard>
          <UiFlex justify="between">
            <UiText weight="semibold">{{ t('action') }}</UiText>
            <SelectPermission v-model="state.IP.user.action" />
          </UiFlex>
        </UCard>
      </template>

      <template #whitelist>
        <UCard>
          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">{{ t('add') }}</UiText>
            <SelectPermission v-model="state.IP.whitelist.add" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">{{ t('edit') }}</UiText>
            <SelectPermission v-model="state.IP.whitelist.edit" />
          </UiFlex>

          <UiFlex justify="between">
            <UiText weight="semibold">{{ t('del') }}</UiText>
            <SelectPermission v-model="state.IP.whitelist.del" />
          </UiFlex>
        </UCard>
      </template>

      <template #item>
        <UCard>
          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">{{ t('add') }}</UiText>
            <SelectPermission v-model="state.item.add" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">{{ t('edit') }}</UiText>
            <SelectPermission v-model="state.item.edit" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">{{ t('del') }}</UiText>
            <SelectPermission v-model="state.item.del" />
          </UiFlex>

          <UiFlex justify="between">
            <UiText weight="semibold">{{ t('export') }}</UiText>
            <SelectPermission v-model="state.item.export" />
          </UiFlex>
        </UCard>
      </template>

      <template #user>
        <UCard>
          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">{{ t('editInfo') }}</UiText>
            <SelectPermission v-model="state.user.editAuth" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">{{ t('editCurrency') }}</UiText>
            <SelectPermission v-model="state.user.editCurrency" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">{{ t('editPay') }}</UiText>
            <SelectPermission v-model="state.user.editPay" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">{{ t('editSpend') }}</UiText>
            <SelectPermission v-model="state.user.editSpend" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">{{ t('editLogin') }}</UiText>
            <SelectPermission v-model="state.user.editLogin" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">{{ t('reset') }}</UiText>
            <SelectPermission v-model="state.user.reset" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">{{ t('del') }}</UiText>
            <SelectPermission v-model="state.user.del" />
          </UiFlex>

          <UiFlex justify="between">
            <UiText weight="semibold">{{ t('export') }}</UiText>
            <SelectPermission v-model="state.user.export" />
          </UiFlex>
        </UCard>
      </template>

      <template #level>
        <UCard>
          <UiFlex justify="between">
            <UiText weight="semibold">{{ t('edit') }}</UiText>
            <SelectPermission v-model="state.level.edit" />
          </UiFlex>
        </UCard>
      </template>

      <template #gate>
        <UCard>
          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">{{ t('add') }}</UiText>
            <SelectPermission v-model="state.gate.add" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">{{ t('edit') }}</UiText>
            <SelectPermission v-model="state.gate.edit" />
          </UiFlex>

          <UiFlex justify="between">
            <UiText weight="semibold">{{ t('del') }}</UiText>
            <SelectPermission v-model="state.gate.del" />
          </UiFlex>
        </UCard>
      </template>

      <template #payment>
        <UCard>
          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">{{ t('editConfig') }}</UiText>
            <SelectPermission v-model="state.payment.configUpdate" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">{{ t('actionVerify') }}</UiText>
            <SelectPermission v-model="state.payment.verify" />
          </UiFlex>

          <UiFlex justify="between">
            <UiText weight="semibold">{{ t('undo') }}</UiText>
            <SelectPermission v-model="state.payment.undo" />
          </UiFlex>
        </UCard>
      </template>

      <template #spend>
        <UCard>
          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">{{ t('add') }}</UiText>
            <SelectPermission v-model="state.spend.add" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">{{ t('edit') }}</UiText>
            <SelectPermission v-model="state.spend.edit" />
          </UiFlex>

          <UiFlex justify="between">
            <UiText weight="semibold">{{ t('del') }}</UiText>
            <SelectPermission v-model="state.spend.del" />
          </UiFlex>
        </UCard>
      </template>

      <template #shop>
        <UCard>
          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">{{ t('editConfig') }}</UiText>
            <SelectPermission v-model="state.shop.configUpdate" />
          </UiFlex>
          
          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">{{ t('add') }}</UiText>
            <SelectPermission v-model="state.shop.add" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">{{ t('edit') }}</UiText>
            <SelectPermission v-model="state.shop.edit" />
          </UiFlex>

          <UiFlex justify="between">
            <UiText weight="semibold">{{ t('del') }}</UiText>
            <SelectPermission v-model="state.shop.del" />
          </UiFlex>
        </UCard>
      </template>

      <template #event>
        <UCard>
          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">{{ t('add') }}</UiText>
            <SelectPermission v-model="state.event.add" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">{{ t('edit') }}</UiText>
            <SelectPermission v-model="state.event.edit" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">{{ t('del') }}</UiText>
            <SelectPermission v-model="state.event.del" />
          </UiFlex>

          <UiFlex justify="between">
            <UiText weight="semibold">{{ t('delHistory') }}</UiText>
            <SelectPermission v-model="state.event.delHistory" />
          </UiFlex>
        </UCard>
      </template>

      <template #limited>
        <UCard>
          <UiFlex justify="between">
            <UiText weight="semibold">{{ t('edit') }}</UiText>
            <SelectPermission v-model="state.limited.update" />
          </UiFlex>
        </UCard>
      </template>

      <template #giftcode>
        <UCard>
          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">{{ t('add') }}</UiText>
            <SelectPermission v-model="state.giftcode.add" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">{{ t('edit') }}</UiText>
            <SelectPermission v-model="state.giftcode.edit" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">{{ t('del') }}</UiText>
            <SelectPermission v-model="state.giftcode.del" />
          </UiFlex>

          <UiFlex justify="between">
            <UiText weight="semibold">{{ t('delHistory') }}</UiText>
            <SelectPermission v-model="state.giftcode.delHistory" />
          </UiFlex>
        </UCard>
      </template>

      <template #wheel>
        <UCard>
          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">{{ t('add') }}</UiText>
            <SelectPermission v-model="state.wheel.add" />
          </UiFlex>

          <UiFlex justify="between" class="mb-4">
            <UiText weight="semibold">{{ t('edit') }}</UiText>
            <SelectPermission v-model="state.wheel.edit" />
          </UiFlex>

          <UiFlex justify="between">
            <UiText weight="semibold">{{ t('del') }}</UiText>
            <SelectPermission v-model="state.wheel.del" />
          </UiFlex>
        </UCard>
      </template>

      <template #egg>
        <UCard>
          <UiFlex justify="between">
            <UiText weight="semibold">{{ t('edit') }}</UiText>
            <SelectPermission v-model="state.egg.update" />
          </UiFlex>
        </UCard>
      </template>

      <template #game>
        <UCard>
          <UiFlex justify="between">
            <UiText weight="semibold">{{ t('gameSendMail') }}</UiText>
            <SelectPermission v-model="state.game.sendItem" />
          </UiFlex>
        </UCard>
      </template>
    </UAccordion>

    <UiFlex justify="end" class="mt-2">
      <UButton class="bg-btn" @click="update()" :loading="updating">{{ t('update') }}</UButton>
    </UiFlex>
  </UiContent>
</template>

<script setup>
const { t } = useI18n()

const load = ref(true)
const updating = ref(false)

const state = ref({
  config: {
    update: [],
    action: [],
  },
  news: {
    add: [],
    edit: [],
    del: [],
  },
  ads: {
    add: [],
    edit: [],
    del: [],
  },
  IP: {
    user: {
      action: [],
    },
    whitelist: {
      add: [],
      edit: [],
      del: [],
    }
  },
  item: {
    add: [],
    edit: [],
    del: [],
    export: [],
  },
  user: {
    editAuth: [],
    editCurrency: [],
    editPay: [],
    editSpend: [],
    editLogin: [],
    reset: [],
    del: [],
    export: []
  },
  level: {
    edit: [],
  },
  gate: {
    add: [],
    edit: [],
    del: [],
  },
  payment: {
    configUpdate: [],
    verify: [],
    undo: [],
  },
  spend: {
    add: [],
    edit: [],
    del: [],
  },
  shop: {
    configUpdate: [],
    add: [],
    edit: [],
    del: [],
    delHistory: [],
  },
  event: {
    add: [],
    edit: [],
    del: [],
    delHistory: [],
  },
  limited: {
    update: [],
  },
  giftcode: {
    add: [],
    edit: [],
    del: [],
    delHistory: [],
  },
  wheel: {
    add:  [],
    edit:  [],
    del:  [],
  },
  egg: {
    update:  [],
  },
  game: {
    sendItem: [],
  }
})

const menu = computed(() => [
  { label: t('menuManageConfig'), slot: 'config' },
  { label: t('menuManageNews'), slot: 'news' },
  { label: t('menuManageAds'), slot: 'ads' },
  { label: t('menuManageIPUser'), slot: 'ipuser' },
  { label: t('menuManageIPWhiteList'), slot: 'whitelist' },
  { label: t('menuManageItem'), slot: 'item' },
  { label: t('menuManageUser'), slot: 'user' },
  { label: t('menuManageUserLevel'), slot: 'level' },
  { label: t('menuManageGate'), slot: 'gate' },
  { label: t('menuManagePayment'), slot: 'payment' },
  { label: t('menuManageSpend'), slot: 'spend' },
  { label: t('menuManageShop'), slot: 'shop' },
  { label: t('menuManageEvent'), slot: 'event' },
  { label: t('menuManageLimited'), slot: 'limited' },
  { label: t('menuManageGiftcode'), slot: 'giftcode' },
  { label: t('menuManageMinigameWheel'), slot: 'wheel' },
  { label: t('menuManageMinigameEgg'), slot: 'egg' },
  { label: t('menuManageGame'), slot: 'game' },
])

const getPermission = async () => {
  const permission = await useAPI('config/manage/permission/get')
  state.value = Object.assign(state.value, permission)
  load.value = false
}

const update = async () => {
  try {
    updating.value = true

    await useAPI('config/manage/permission/update', state.value)
    getPermission()
    updating.value = false
  }
  catch(e) {
    updating.value = false
  }
}

getPermission()
</script>