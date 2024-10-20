<script setup lang="ts">
const product = defineProps([
	'title',
	'type',
	'imageUrl',
	'brand',
	'price',
	'label',
	'slug',
	'subtype',
	'offers',
	'productId'
])

let printifyOffers: any[] = [];
if (product.offers) {
	printifyOffers = product.offers.filter((item:any) => item.productId == product.productId)
}

let printifyOffer : any = null;
if (printifyOffers.length) {
	printifyOffer = printifyOffers[0]
}

const link = `/shop/${product.slug}`
</script>

<template>
<div class="pb-5">
	<h3>
        <nuxt-link :to="link" class="block max-h-7 overflow-hidden text-white font-bold text-lg uppercase">{{product.title}}</nuxt-link>
    </h3>
	<h4 class="opacity-50 text-white">{{product.subtype}} {{product.type}}</h4>
	<nuxt-link :to="link" class="block py-2 relative">
		<nuxt-img width="auto" height="auto" :alt="product.title" :src="product.imageUrl" />
		<div class="bg-neurodarkgrey p-1 rounded text-sm text-white absolute top-5 right-3" v-if="product.label">{{product.label.toUpperCase()}}</div>
		<div class="bg-red-900 p-1 rounded text-sm text-white absolute top-5 left-3" v-if="printifyOffer.stock < 8 && printifyOffer.stock > 0">ONLY A FEW LEFT</div>
		<div class="bg-red-900 p-1 rounded text-sm text-white absolute top-5 left-3" v-if="printifyOffer.stock == 0">OUT OF STOCK</div>
	</nuxt-link>
	<div class="flex flex-row">
		<div v-if="product.type == 'T-Shirt'">
			<p class="opacity-50 text-white">Brand</p>
			<h5 class="text-white">{{product.brand}}</h5>
		</div>
		<div v-if="product.type == 'Cassette'">
			<p class="opacity-50 text-white">Artist</p>
			<h5 class="text-white">{{product.brand}}</h5>
		</div>
		<div v-if="printifyOffers.length" class="ml-auto my-auto text-2xl text-white font-bold">
			€{{(printifyOffer.price / 100).toFixed(2)}}
		</div>
	</div>
</div>
</template>
