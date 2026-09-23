<template>
  <UiContent :title="t('menuManageConfigPage')" :sub="t('menuManageConfigPageInfo')" class="max-w-3xl mx-auto">
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

      <template #basic>
        <UCard>
          <UForm :state="state">
            <UFormGroup :label="t('manageConfigPageName')">
              <UInput v-model="state.name" />
            </UFormGroup>

            <UFormGroup :label="t('manageConfigPageShort')">
              <UInput v-model="state.short_name" />
            </UFormGroup>

            <UFormGroup :label="t('manageConfigPageDescription')">
              <UTextarea autoresize v-model="state.description" name="input" />
            </UFormGroup>

            <UFormGroup :label="t('manageConfigPageLogoSquare')">
              <UiUploadImage v-model="state.logo_image">
                <template #default="{ select, loading }">
                  <UInput :model-value="state.logo_image" :loading="loading" readonly @click="select"/>
                </template>
              </UiUploadImage>
            </UFormGroup>

            <UFormGroup :label="t('manageConfigPageLogoLong')">
              <UiUploadImage v-model="state.logo_long_image">
                <template #default="{ select, loading }">
                  <UInput :model-value="state.logo_long_image" :loading="loading" readonly @click="select"/>
                </template>
              </UiUploadImage>
            </UFormGroup>

            <UFormGroup :label="t('manageConfigPageBanner')">
              <UiUploadImage v-model="state.og_image">
                <template #default="{ select, loading }">
                  <UInput :model-value="state.og_image" :loading="loading" readonly @click="select"/>
                </template>
              </UiUploadImage>
            </UFormGroup>

            <UiFlex justify="end">
              <UButton class="bg-btn" @click="update('basic')" :loading="updating">{{ t('update') }}</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>

      <template #download>
        <UCard>
          <UForm :state="state">
            <UFormGroup :label="t('manageConfigPageDownloadAPK')">
              <UInput v-model="state.download.apk" />
            </UFormGroup>

            <UFormGroup :label="t('manageConfigPageDownloadAPK')">
              <UInput v-model="state.download.ios" />
            </UFormGroup>

            <UiFlex justify="end" class="mt-4">
              <UButton class="bg-btn" @click="update('basic')" :loading="updating">{{ t('update') }}</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>

      <template #contact>
        <UCard>
          <UForm :state="state">
            <UFormGroup :label="t('manageConfigContactName')">
              <UInput v-model="state.contact.name" />
            </UFormGroup>

            <UFormGroup :label="t('manageConfigContactShort')">
              <UInput v-model="state.contact.prefix" />
            </UFormGroup>

            <UFormGroup :label="t('manageConfigContactPhone')">
              <UInput v-model="state.contact.phone" />
            </UFormGroup>

            <UFormGroup :label="t('manageConfigContactEmail')">
              <UInput v-model="state.contact.email"/>
            </UFormGroup>

            <UFormGroup :label="t('manageConfigContactAddress')">
              <UInput v-model="state.contact.address" />
            </UFormGroup>

            <UiFlex justify="end" class="mt-4">
              <UButton class="bg-btn" @click="update('contact')" :loading="updating">{{ t('update') }}</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>

      <template #social>
        <UCard>
          <UForm :state="state">
            <UFormGroup label="Facebook">
              <UInput v-model="state.social.facebook" />
            </UFormGroup>

            <UFormGroup label="Messenger">
              <UInput v-model="state.social.messenger" />
            </UFormGroup>

            <UFormGroup label="Zalo">
              <UInput v-model="state.social.zalo" />
            </UFormGroup>

            <UFormGroup label="Telegram">
              <UInput v-model="state.social.telegram" />
            </UFormGroup>

            <UFormGroup label="Tiktok">
              <UInput v-model="state.social.tiktok" />
            </UFormGroup>

            <UiFlex justify="end" class="mt-4">
              <UButton class="bg-btn" @click="update('social')" :loading="updating">{{ t('update') }}</UButton>
            </UiFlex>
          </UForm>
        </UCard>
      </template>

      <template #notice>
        <UCard>
          <UForm :state="state">
            <UFormGroup :label="t('title')">
              <UInput v-model="state.notice.title" />
            </UFormGroup>

            <UFormGroup :label="t('description')">
              <UInput v-model="state.notice.description" />
            </UFormGroup>

            <UFormGroup :label="t('time')">
              <UiFlex class="gap-1">
                <UInput v-model="state.notice.time.start" type="time" class="grow" :placeholder="t('start')" />
                <UInput v-model="state.notice.time.end" type="time" class="grow" :placeholder="t('end')" />
              </UiFlex>
            </UFormGroup>

            <UFormGroup :label="t('content')" v-if="state.notice.content">
              <UiEditor v-model="state.notice.content" />
            </UFormGroup>

            <UiFlex justify="end">
              <UButton class="bg-btn" @click="update('notice')" :loading="updating">{{ t('update') }}</UButton>
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

  name: '',
  short_name: '',
  description: '',
  og_image: '',
  logo_image: '',
  logo_long_image: '',
  makeby: '',

  notice: {
    title: '',
    description: '',
    content: '',
    time: {
      start: null,
      end: null
    }
  },

  download: {
    apk: '',
    ios: '',
  },

  contact: {
    name: '',
    phone: '',
    email: '',
    address: '',
    prefix: '',
  },

  social: {
    facebook: '',
    messenger: '',
    zalo: '',
    telegram: '',
    tiktok: ''
  }
})

const menu = computed(() => [
  { label: t('basic'), slot: 'basic' },
  { label: t('download'), slot: 'download' },
  { label: t('contact'), slot: 'contact' },
  { label: t('social'), slot: 'social'},
  { label: t('notice'), slot: 'notice'}
])

const getConfig = async () => {
  const config = await useAPI('config/manage/get')
  state.value = Object.assign(state.value, config)
  if(!config.notice) state.value.notice = {
    content: '',
    time: {
      start: null,
      end: null
    }
  }
  else {
    state.value.notice.title = config.notice.title
    state.value.notice.description = config.notice.description
    state.value.notice.content = config.notice.content || '<p></p>'
    state.value.notice.time = {
      start: config.notice.time ? config.notice.time.start : null,
      end: config.notice.time ? config.notice.time.end : null,
    }
  }
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