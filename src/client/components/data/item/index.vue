<template>
  <div v-if="item" class="
    relative inline-block
    cursor-pointer
    rounded-2xl
  ">
    <DataItemImage 
      class="p-1"
      :size="size"
      :src="item.image || item.item_image" 
      :type="item.type"
      @click="modal = true" 
    />

    <UiFlex 
      v-if="amount && amount > 0"
      class="
        absolute
        bottom-0 right-0
        rounded-2xl
        px-[6px] py-[1px]
        bg-black/50 backdrop-blur-lg font-medium text-xs text-white
        cursor-pointer
      "
      @click="modal = true" 
    >
      <UiText align="center" weight="bold" >
        {{ miniMoney(amount) }}
      </UiText>
    </UiFlex>

    <UModal v-model="modal" :ui="{ width: 'max-w-[220px] sm:max-w-[220px]' }">
      <div class="bg-card rounded-2xl p-4">
        <DataItemImage :src="item.image || item.item_image" :type="item.type" :size="110" class="mx-auto mb-2" />

        <UiFlex type="col" class="mt-4">
          <UiText weight="bold" align="center" class="max-w-[90%] leading-[1.5rem] text-sm sm:text-base md:text-lg">
            {{ item.name || item.item_name }}
          </UiText>
          <UBadge size="md" class="bg-card-box px-4 md:px-6 max-w-full mt-2" v-if="!!amount && amount > 0">x{{ toMoney(amount) }}</UBadge>
        </UiFlex>
      </div>
    </UModal>
  </div>
</template>

<script setup>
const { miniMoney, toMoney } = useMoney()
const props = defineProps({
  item: Object,
  amount: [ String, Number ],
  size: { type: [ String, Number ]}
})

const modal = ref(false)
</script>