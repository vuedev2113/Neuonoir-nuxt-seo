<script setup lang="ts">
import Container from "~/components/layout/Container.vue";
import Spinner from "~/components/misc/Spinner.vue";

const config = useRuntimeConfig()
const { params } = useRoute()

const printifyData = ref(null)
const fullyMounted = ref(false)
const selectedSize = ref(null)
const loading = ref(true)
const variantMatch = ref(null)

const sizes = computed(() => {
	if (product.type === 'T Shirt') {
		return { "name": "Sizes", "type": "size", "values": [{ "id": 14, "title": "S" }, { "id": 15, "title": "M" }, { "id": 16, "title": "L" }, { "id": 17, "title": "XL" }, { "id": 18, "title": "2XL" }], "display_in_preview": false };
	}

	if (!printifyData) {
		return []
	}

	if (!printifyData.value) {
		return []
	}

	if (!printifyData.value.options.length) {
		return []
	}

	return printifyData.value.options[1]
})

const { product } = await GqlGetProduct({
	slug: params.slug
})

let preOrder = false
if (product) {
	product.properties.forEach(property => {
		if (property.key.includes("Pre-Order")) {
			preOrder = true
		}
	})
}

const { offer } = await GqlGetOffer({
	productId: product.productId
})

const { variants } = await GqlGetVariant({
	slug: product.productId
})

useHead({
	title: `Neuronoir | ${product.title} ${product.type}`,
	meta: [
		{ name: 'description', content: 'Browse through our merchandise and other music related products. Dark and Heavy music made in Romania.' },
		{ property: 'og:title', content: `Neuronoir | ${product.title} ${product.type}` },
		{ property: 'og:description', content: 'Browse through our merchandise and other music related products. Dark and Heavy music made in Romania.' },
	]
})

if (product.type === 'T-Shirt') {
	fetch(config.public.baseURL + "/api/products/" + product.productId).then(response => {
		response.json().then(data => {
			printifyData.value = data
			fullyMounted.value = true

			if (sizes) {
				sizes.value.values.forEach(option => {
					if (option.title === 'M') {
						selectSize(option)
					}
				})
			}

			loading.value = false
		})
	})
} else {
	loading.value = false
	fullyMounted.value = true

	if (!Array.isArray(sizes.value)) {
		sizes.value.values.forEach(option => {
			if (option.title === 'M') {
				selectSize(option)
			}
		})
	}
}

function addToCart() {
	if (process.client) {
		const cartData = localStorage.getItem("neuronoirCart")
		const item = {
			'product': product,
			'selectedSize': selectedSize.value,
			'quantity': 1
		}

		let cart = []
		if (cartData) {
			cart = JSON.parse(cartData)
			cart.push(item)
		} else {
			cart = [item]
		}

		localStorage.setItem('neuronoirCart', JSON.stringify(cart))
		window.location.href = '/cart'
	}
}

function selectSize(size) {
	selectedSize.value = size

	if (product?.type === 'T-Shirt') {
		const match = printifyData.value.variants.filter(variant => {
			if (!variant.is_enabled) {
				return false
			}

			let variantWithSize = variant.options.filter(option => {
				return option === size.id
			})

			return !!variantWithSize.length
		})

		variantMatch.value = match[0]
	}

	if (product?.type === 'T Shirt') {
		let match = variants.filter(variant => {
			if (variant.variant == size.title) {
				return true
			}

			return false
		})

		if (match[0].stock <= 0) {
			match[0].is_available = false
		} else {
			match[0].is_available = true
		}

		variantMatch.value = match[0]
	}
}

</script>

<template>
	<Container class="bg-neurodarkgreyvar">
		<div class="grid lg:grid-cols-2 grid-cols-1 gap-10 py-10" v-if="product">
			<div>
				<nuxt-link to="/shop" class="text-neurolink mb-5 block">Back to shop</nuxt-link>
				<h3 class="text-4xl font-bold text-white block">{{ product.title }}</h3>
				<p class="text-white font-light opacity-50 block mb-5">{{ product.type }}</p>
				<nuxt-img :alt="product.title" :src="product.image.url" class="w-full" />
			</div>
			<div class="mt-20">
				<Spinner v-if="loading"></Spinner>
				<div v-if="variantMatch">
					<div class="text-red-700" v-if="!variantMatch.is_available">The selected size is currently out of
						stock.</div>
				</div>
				<div v-if="fullyMounted && (product.type === 'T-Shirt' || product.type === 'T Shirt')">
					<div class="text-white font-light opacity-50 pb-3 mt-10">Size</div>
					<span v-for="option in sizes.values"
						:class="selectedSize?.title === option.title ? 'border border-white bg-neuroprimary rounded border-opacity-50 px-3 py-2 mr-3' : 'border border-white rounded border-opacity-50 px-3 py-2 mr-3'">
						<button @click="selectSize(option)" class="mx-auto my-auto text-white font-bold">
							{{ option.title }}
						</button>
					</span>
				</div>
				<div class="grid grid-cols-3 gap-5 pt-10">
					<div class="col-span-2">
						<button @click="addToCart"
							class="w-full border border-neuroprimary bg-neuroprimary py-2 rounded text-white"
							v-if="offer.stock > 0 && !preOrder">
							Add to cart
						</button>
						<button @click="addToCart"
							class="w-full border border-neuroprimary bg-neuroprimary py-2 rounded text-white"
							v-if="offer.stock > 0 && preOrder">
							Pre-Order
						</button>
						<span class="block text-center w-full border border-error bg-error py-2 rounded text-white"
							v-if="offer.stock < 1">
							Currently not in stock
						</span>
					</div>
					<div class="col-span-1" v-if="variantMatch">
						<div
							class="border text-center border-white border-opacity-20 py-2 rounded text-white font-bold">
							€{{ (variantMatch.price / 100).toFixed(2) }}
						</div>
					</div>
					<div class="col-span-1" v-if="product.type != 'T-Shirt' && product.type != 'T Shirt'">
						<div
							class="border text-center border-white border-opacity-20 py-2 rounded text-white font-bold">
							€{{ (offer.price / 100).toFixed(2) }}
						</div>
					</div>
				</div>
				<div class="my-10 border border-b w-full border-white border-opacity-10"></div>

				<div class="grid grid-cols-3 gap-5 pb-5">
					<div v-for="property in product.properties">
						<div v-if="property.visible">
							<div class="text-white font-light opacity-50">{{ property.key }}</div>
							<span class="text-white">{{ property.value }}</span>
						</div>
					</div>
				</div>

				<div class="grid grid-cols-2 gap-10 pb-20">
					<div>
						<span class="px-2 py-2 bg-white bg-opacity-5 rounded-xl">
							<Icon class="mb-1" name="iconoir:delivery-truck" color="white" />
						</span>
						<span class="my-auto pl-2 text-white font-light">2-15 days shipping</span>
					</div>
					<div>
						<span class="px-2 py-2 bg-white bg-opacity-5 rounded-xl">
							<Icon class="mb-1" name="iconoir:money-square" color="white" />
						</span>
						<span class="my-auto pl-2 text-white font-light">VAT included</span>
					</div>
					<div v-if="offer.stock < 20 && offer.stock > 0">
						<span class="px-2 py-2 bg-red-900 rounded-xl">
							<Icon class="mb-1" name="iconoir:garage" color="white" />
						</span>
						<span class="my-auto pl-2 text-white font-light">Low Stock</span>
					</div>
				</div>
			</div>
		</div>
	</Container>
</template>
