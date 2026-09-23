<template>
  <UiContent :title="t('menuManageConfigAPISocial')" :sub="t('menuManageConfigAPISocialInfo')" class="max-w-3xl mx-auto">
    <UAccordion
      color="primary"
      variant="soft"
      size="md"
      :items="menu"
    >
      <template #default="{ item, open }">
        <UButton size="md" class="bg-card-box mb-1">
          <UiText class="text-white" :class="{
            '!text-gray-400': !open,
            '!text-primary-400': !!open
          }">{{ item.label }}</UiText>
        </UButton>
      </template>

      <template #facebook>
        <UCard>
          <UForm :state="state">
            <UFormGroup label="Client ID">
              <UInput v-model="state.facebook.client_id" />
            </UFormGroup>

            <UFormGroup label="Client Secret">
              <UInput v-model="state.facebook.client_secret" />
            </UFormGroup>

            <UFormGroup label="Client Version">
              <UInput v-model="state.facebook.client_version" />
            </UFormGroup>

            <UFormGroup label="Client Verify">
              <UInput v-model="state.facebook.client_verify" />
            </UFormGroup>

            <UFormGroup label="Client Ads">
              <UInput v-model="state.facebook.client_ads" />
            </UFormGroup>

            <UiFlex justify="end">
              <UButton color="yellow" @click="update('facebook')" :loading="updating">{{ t('update') }}</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>

      <template #google>
        <UCard>
          <UForm :state="state">
            <UFormGroup label="Client ID">
              <UInput v-model="state.google.client_id" />
            </UFormGroup>

            <UFormGroup label="Client Secret">
              <UInput v-model="state.google.client_secret" />
            </UFormGroup>

            <UFormGroup label="Client Verify">
              <UInput v-model="state.google.client_verify" />
            </UFormGroup>

            <UFormGroup label="ClientAds">
              <UInput v-model="state.google.client_ads" />
            </UFormGroup>

            <UiFlex justify="end">
              <UButton color="yellow" @click="update('google')" :loading="updating">{{ t('update') }}</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>

      <template #tiktok>
        <UCard>
          <UForm :state="state">
            <UFormGroup label="Client ID">
              <UInput v-model="state.tiktok.client_id" />
            </UFormGroup>

            <UFormGroup label="Client Secret">
              <UInput v-model="state.tiktok.client_secret" />
            </UFormGroup>

            <UiFlex justify="end">
              <UButton color="yellow" @click="update('tiktok')" :loading="updating">{{ t('update') }}</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>

      <template #zalo>
        <UCard>
          <UForm :state="state">
            <UFormGroup label="Client ID">
              <UInput v-model="state.zalo.client_id" />
            </UFormGroup>

            <UFormGroup label="Client Secret">
              <UInput v-model="state.zalo.client_secret" />
            </UFormGroup>

            <UFormGroup label="Client Verify">
              <UInput v-model="state.zalo.client_verify" />
            </UFormGroup>

            <UiFlex justify="end">
              <UButton color="yellow" @click="update('zalo')" :loading="updating">{{ t('update') }}</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>

      <template #telegram>
        <UCard>
          <UForm :state="state">
            <UFormGroup :label="t('manageConfigAPISocialTelegramNotiPay')">
              <UInput v-model="state.telegram.payment" />
            </UFormGroup>

            <UFormGroup :label="t('manageConfigAPISocialTelegramNotiGM')">
              <UInput v-model="state.telegram.manage" />
            </UFormGroup>

            <UiFlex justify="end">
              <UButton color="yellow" @click="update('telegram')" :loading="updating">{{ t('update') }}</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>

      <template #cloudflare>
        <UCard>
          <UForm :state="state">
            <UFormGroup label="Site Key">
              <UInput v-model="state.cloudflare.site_key" />
            </UFormGroup>

            <UFormGroup label="Secret Key">
              <UInput v-model="state.cloudflare.secret_key" />
            </UFormGroup>

            <UiFlex justify="end">
              <UButton color="yellow" @click="update('cloudflare')" :loading="updating">{{ t('update') }}</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>
    </UAccordion>
  </UiContent>
</template>

<script setup>
const { t } = useI18n()
const { bootConfig } = useConfigStore()

const load = ref(true)
const updating = ref(false)

const state = ref({
  change: null,

  facebook: {
    client_id: '',
    client_secret: '',
    client_version: '',
    client_verify: '',
    client_ads: ''
  },
  google: {
    client_id: '',
    client_secret: '',
    client_verify: '',
    client_ads: ''
  },
  tiktok: {
    client_id: '',
    client_secret: '',
    client_verify: '',
  },
  zalo: {
    client_id: '',
    client_secret: '',
    client_verify: '',
  },
  telegram: {
    payment: '',
    manage: '',
  },
  cloudflare: {
    site_key: '',
    secret_key: '',
  }
})

const menu = [
{
  label: 'Facebook',
  slot: 'facebook'
},
{
  label: 'Google',
  slot: 'google'
},
{
  label: 'Tiktok',
  slot: 'tiktok'
},
{
  label: 'Zalo',
  slot: 'zalo'
},
{
  label: 'Telegram',
  slot: 'telegram'
},
{
  label: 'Cloudflare',
  slot: 'cloudflare'
}
]

const getConfig = async () => {
  const config = await useAPI('config/manage/get')
  state.value = Object.assign(state.value, config)
  load.value = false
}

const update = async (change) => {
  try {
    updating.value = true
    state.value.change = change

    await useAPI('config/manage/update', state.value)
    bootConfig()
    getConfig()
    updating.value = false
  }
  catch(e) {
    updating.value = false
  }
}

getConfig()
</script>