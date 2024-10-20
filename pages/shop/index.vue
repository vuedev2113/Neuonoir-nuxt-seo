<script setup lang="ts">

import Product from "~/components/shop/Product.vue";
import Section from "~/components/layout/Section.vue";
import Container from "~/components/layout/Container.vue";

const config = useRuntimeConfig()
const response = await GqlGetProducts();
const products = response.products;

const offersResponse = await GqlGetOffers();
const offers = offersResponse.offers;

useHead({
	title: "Neuronoir | Shop",
	meta: [
		{name: 'description', content: 'Browse through our merchandise and other music related products. Dark and Heavy music made in Romania.'},
		{ name: 'keywords', content: 'music shop, shop, music, Romania' },
		{ property: 'og:title', content: 'Neuronoir | Shop' },
		{ property: 'og:description', content: 'Browse through our merchandise and other music related products. Dark and Heavy music made in Romania.' },
		{ property: 'og:url', content: 'https://www.neuronoir.art/shop' },
	],
})
</script>

<template>
	<Container class="bg-neurodarkgreyvar">
		<Section
			title="Shop"
			description="Browse through our merchandise and other music related products."
		></Section>

		<div class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-7 pb-20">
			<div class="col-span-1" v-for="product, i in products" :key="i" v-if="offers">
				<Product
					:offers="offers"
					:title="product.title"
					:type="product.type"
					:image-url="product.image.url"
					:brand="product.brand"
					:label="product.label"
					:slug="product.slug"
					:subtype="product.subtype"
					:productId="product.productId"
				></Product>
			</div>
		</div>
	</Container>
</template>
