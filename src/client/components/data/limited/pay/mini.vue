<template>
	<UiEffectOb v-if="!!eventData">
		<UiFlex 
			type="col" justify="center" 
			class="relative h-[60px] max-h-[60px] md:h-[80px] md:max-h-[80px] cursor-pointer beat-anim" 
			@click="configStore.setEventLimitedModal('pay', true)"
		>
			<img :src="`/images/limited/pay/money.png`" class="h-[40px] md:h-[50px] w-[40px] md:w-[50px] z-[1]" />
			<div class="FTV absolute limited-pay-text bottom-[-5px] text-[0.6rem] sm:text-xs bg-card-box backdrop-blur rounded-2xl px-2 py-0.5 z-[1]" mini>
				<UiCountdown :time="eventData.time.end" />
			</div>
		</UiFlex>
	</UiEffectOb>
</template>

<script setup>
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'
const { t } = useI18n()
const configStore = useConfigStore()
const eventData = computed(() => configStore.eventLimited.pay.data)
</script>