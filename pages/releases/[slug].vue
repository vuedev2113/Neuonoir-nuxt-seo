<script setup lang="ts">
import Dropdown from 'v-dropdown'

definePageMeta({
	layout: 'linktree'
})

const {params} = useRoute()
const config = useRuntimeConfig()

const response = await GqlGetRelease({
	slug: params.slug.toString()
});
const release = response.release
const title = `${release.artist.name} | ${response.release.name}`
const description = 'Here are all the details about ' + response.release.name + '. Dark and Heavy music made in Romania.'
useHead({
	title: title,
	meta: [
		{ name: 'description', content: description },
		{ name: 'keywords', content: title },
		{ property: 'og:title', content: title },
		{ property: 'og:description', content: description },
	]
})

useSeoMeta({
	title: title,
	ogTitle: title,
	ogImage: release.image.url,
	twitterCard: release.image.url,
	description: description,
	ogDescription: description,
})

const offersResponse = await GqlGetOffers();
const offers = offersResponse.offers;

function getProductPrice(productId) {
	let printifyOffers = offers.filter((item: any) => item.productId == productId)
	return `€${(printifyOffers[0].price / 100).toFixed(2)}`
}

</script>

<template>
	<div :class="release.properties.mainBackground">
		<div class="w-64 mx-auto">
			<nuxt-img :alt="release.name" :src="release.image.url" class="rounded" />
			<div class="flex py-5">
				<div class="flex-1">
					<nuxt-link :to="`/artists/${release.artist.slug}`" :class="release.properties.artistName">{{ release.artist.name.toUpperCase() }}</nuxt-link>
					<h3 :class="release.properties.releaseName">{{ release.name }}</h3>
				</div>
				<div class="my-auto">
					<Dropdown>
						<!-- dropdown trigger -->
						<template #trigger>
							<button>
								<Icon size="17px" name="iconoir-menu" :class="release.properties.menuIconColor"/>
							</button>
						</template>

						<div class="py-2 px-3">
							<nuxt-link :to="`/artists/${release.artist.slug}`" class="text-sm block py-3">Artist Page</nuxt-link>
							<a target="_blank" v-for="link in release.artist.links" :href="link.url" class="block py-3 text-sm">{{link.name}}</a>
						</div>
					</Dropdown>
				</div>
			</div>
			<a :class="release.properties.linkBorder" :href="platform.url" target="_blank" v-for="platform in release.links">
				<div class="flex-1 flex">
					<Icon size="27px" :name="platform.icon" :class="release.properties.linkIcon"/>
					<div :class="release.properties.linkPlatform">{{ platform.name }}</div>
				</div>
				<div>
					<Icon size="17px" name="iconoir-link" :class="release.properties.linkUrlIcon"/>
				</div>
			</a>
			<div class="bg-white rounded p-3 mb-5" v-for="product in release.artist.products">
				<nuxt-link :to="`/shop/${product.slug}`">
					<nuxt-img :alt="product.slug" :src="product.image.url" />
				</nuxt-link>
				<div class="my-auto text-center">
					<h4 class="font-bold">{{ product.title }}</h4>
					<h6 class="opacity-80">{{ product.type }}</h6>
					<div class="font-bold">{{ getProductPrice(product.productId) }}</div>
				</div>
				<nuxt-link :to="`/shop/${product.slug}`" class="block text-center mt-4 rounded bg-neuroprimary px-2 py-2 text-white">Add to cart</nuxt-link>
			</div>
			<div class="p-5"></div>
		</div>
	</div>
</template>

<style scoped>

</style>