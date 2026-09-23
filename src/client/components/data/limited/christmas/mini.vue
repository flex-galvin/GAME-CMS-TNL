<template>
	<UiEffectOb v-if="!!eventData">
		<UiFlex 
			type="col" justify="center" 
			class="relative h-[60px] max-h-[60px] md:h-[80px] md:max-h-[80px] cursor-pointer beat-anim" 
			@click="configStore.setEventLimitedModal('christmas', true)"
		>
			<img :src="`/images/limited/christmas/santa.png`" class="h-[40px] md:h-[50px] w-[40px] md:w-[50px] z-[1] relative" />
			<div class="FTV absolute bottom-[-5px] christmas-text text-[0.6rem] sm:text-xs bg-card-box backdrop-blur rounded-2xl px-2 py-0.5 z-[1]" mini>
				<UiCountdown :time="eventData.time.end" v-if="!eventData.rewardTime" />
				<span v-else>{{ t('receive') }}</span>
			</div>
		</UiFlex>
	</UiEffectOb>
</template>

<script setup>
const { t } = useI18n()
const configStore = useConfigStore()
const eventData = computed(() => configStore.eventLimited.christmas.data)
</script>