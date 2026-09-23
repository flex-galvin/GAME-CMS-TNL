<template>
	<UiEffectOb>
		<UiFlex 
			type="col" justify="center" 
			class="relative h-[60px] max-h-[60px] md:h-[80px] md:max-h-[80px] cursor-pointer beat-anim" 
			@click="modal = true"
		>
			<img :src="`/images/icon/customer.png`" class="h-[40px] md:h-[50px] w-[40px] md:w-[50px] z-[1]" />
			<UiText class="text-[#a4d6e6] FTV absolute bottom-[-5px] text-[0.6rem] sm:text-xs bg-card-box backdrop-blur rounded-2xl px-2 py-0.5 z-[1]" mini>
				{{ t('support') }}
			</UiText>
		</UiFlex>

		<UModal v-model="modal" :ui="{width: 'sm:max-w-[350px] max-w-[350px]'}">
			<DataSocial class="color-blue-light bg-box-light bg-box-light--active-before rounded-2xl" />
		</UModal>
	</UiEffectOb>
</template>

<script setup>
const { t } = useI18n()
const modal = ref(false)
</script>