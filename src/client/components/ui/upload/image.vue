<template>
  <UiFlex class="relative">
    <input @change="onFileChange" type="file" accept=".jpg,.jpeg,.png,.webp,.gif" ref="input" hidden class="none">
    <div class="grow">
      <slot :select="selectFile" :loading="loading"></slot>
    </div>
    <UiIcon v-if="!!modelValue" name="i-material-symbols-delete" size="6" color="gray" class="ml-2 cursor-pointer" @click="delFile" />
  </UiFlex>
</template>

<script setup>
const { t } = useI18n()

const props = defineProps(['modelValue'])
const emits = defineEmits(['update:modelValue'])
const { success, error } = useNotify()

const input = ref()
const loading = ref(false)

const selectFile = () => input.value.click()

const delFile = () => {
  emits('update:modelValue', null)
}

const onFileChange = async (e) => {
  try {
    loading.value = true

    const files =  e.target.files
    if(files.length == 0) throw t('errorUploadImageNotFile')

    const file = files[0]
    const isImage = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/gif', 'image/svg+xml'].includes(file.type)
    if(!isImage) throw t('errorUploadImageSupport')

    const is10M = file.size / 1024 / 1024 < 10
    if (!is10M) throw t('errorUploadImageSize')

    const formData = new FormData()
    formData.append('image', file)

    const response = await fetch('/api/upload/image', {
      method: 'POST',
      body: formData
    })
    const responseJSON = await response.json()
    if(responseJSON.code != 200) throw responseJSON.message

    const url = responseJSON.result
    if(!url) throw t('errorUploadImage')

    emits('update:modelValue', url)
    e.target.value = ""

    loading.value = false
    success(responseJSON.message)
  }
  catch(err) {
    e.target.value = ""
    loading.value = false
    error(err.toString())
  }
}
</script>