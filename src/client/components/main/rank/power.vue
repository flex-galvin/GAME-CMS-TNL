<template>
  <div>
    <UForm @submit="submit">
      <UiFlex justify="between" class="mb-2">
        <UiTitle :name="t('server')" icon="i-bxs-server" /> 
        <SelectGameServer auto v-model="server" v-model:loading="loading" size="lg"  />
      </UiFlex>

      <UiFlex v-if="!!server">
        <UTabs v-model="tab" :items="tabItems"></UTabs>
      </UiFlex>
    </UForm>

    <Transition name="page" mode="out-in">
      <DataEmpty :loading="loading" class="min-h-[300px]" v-if="!!loading || !server"></DataEmpty>

      <div v-else>
        <Transition name="page" mode="out-in">
          <DataRankList type="power" :server="server" v-if="tab == 0" />
          <DataRankProcessAward type="power" :server="server" v-else-if="tab == 1" />
          <DataRankMissionAward type="power" :server="server" v-else-if="tab == 2" />
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const { t } = useI18n()
const tab = ref(0) 
const tabItems = [
  { label: t('menuRankIndex') },
  { label: t('menuRankTop') },
  { label: t('menuRankMission') },
]
const loading = ref(true)
const server = ref()
</script>