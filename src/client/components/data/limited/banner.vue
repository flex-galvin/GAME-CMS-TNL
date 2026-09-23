<template>
	<UiEffectOb v-if="!!active">
		<ClientOnly>
			<swiper-container 
				:slides-per-view="'auto'"
				:loop="true"
				:autoplay="{ delay: 2500, disableOnInteraction: false }" 
				class="rounded-2xl overflow-hidden pt-0.5"
			>
				<swiper-slide class="w-full" v-if="!!eventPay">
					<DataLimitedPayBanner />
				</swiper-slide>

				<swiper-slide class="w-full" v-if="!!eventShop">
					<DataLimitedShopBanner />
				</swiper-slide>

				<swiper-slide class="w-full" v-if="!!eventHalloween">
        	<DataLimitedHalloweenBanner />
				</swiper-slide>

				<swiper-slide class="w-full" v-if="!!eventChristmas">
        	<DataLimitedChristmasBanner />
				</swiper-slide>

				<swiper-slide class="w-full" v-if="!!eventMonster">
        	<DataLimitedMonsterBanner />
				</swiper-slide>

				<swiper-slide class="w-full" v-if="!!eventLootchest">
        	<DataLimitedLootchestBanner />
				</swiper-slide>

				<swiper-slide class="w-full" v-if="!!eventLunar">
        	<DataLimitedLunarBanner />
				</swiper-slide>
			</swiper-container>
		</ClientOnly>
	</UiEffectOb>
</template>


<script setup>
const configStore = useConfigStore()
const eventShop = computed(() => configStore.eventLimited.shop.data)
const eventPay = computed(() => configStore.eventLimited.pay.data)
const eventHalloween = computed(() => configStore.eventLimited.halloween.data)
const eventChristmas = computed(() => configStore.eventLimited.christmas.data)
const eventMonster = computed(() => configStore.eventLimited.monster.data)
const eventLootchest = computed(() => configStore.eventLimited.lootchest.data)
const eventLunar = computed(() => configStore.eventLimited.lunar.data)

const active = computed(() => {
	return !!eventPay.value 
		|| (!!eventShop.value && eventShop.value.length > 0) 
		|| !!eventHalloween.value 
		|| !!eventChristmas.value 
		|| !!eventMonster.value 
		|| !!eventLootchest.value 
		|| !!eventLunar.value
})
</script>