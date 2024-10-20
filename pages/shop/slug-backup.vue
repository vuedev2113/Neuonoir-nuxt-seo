<script>
import Container from "~/components/layout/Container.vue";
import Spinner from "~/components/misc/Spinner.vue";

export default defineNuxtComponent({
	name: '[slug]',
	components: { Spinner, Container },
	head(nuxt) {
		return {
			title: "Neuronoir | Shop"
		}
	},
	async setup() {
		const { params } = useRoute()
		const productPayload = await GqlGetProduct({
			slug: params.slug
		})

		return {
			product: productPayload.product,
		}
	},
	data() {
		return {
			title: "Shop",
			loading: true,
			config: useRuntimeConfig(),
			printifyData: null,
			fullyMounted: false,
			selectedSize: null,
			variantMatch: null
		}
	},
	computed: {
		sizes() {
			if (!this.printifyData) {
				return []
			}

			if (!this.printifyData.options.length) {
				return []
			}

			return this.printifyData.options[1]
		},
	},
	mounted() {
		if (this.product) {
			this.title = this.product.title
			fetch(this.config.public.baseURL + "/api/products/" + this.product.productId).then(response => {
				response.json().then(data => {
					this.printifyData = data
					this.fullyMounted = true
					if (this.sizes) {
						this.sizes.values.forEach(option => {
							if (option.title === 'M') {
								this.selectSize(option)
							}
						})
					}
					this.loading = false
				})
			})
		}
	},
	methods: {
		addToCart() {
			if (process.client) {
				const cartData = localStorage.getItem("neuronoirCart")
				const item = {
					'product': this.product,
					'selectedSize': this.selectedSize,
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
		},
		selectSize(size) {
			this.selectedSize = size

			const variantMatch = this.printifyData.variants.filter(variant => {
				if (!variant.is_enabled) {
					return false
				}

				let variantWithSize = variant.options.filter(option => {
					return option === size.id
				})

				return !!variantWithSize.length
			})

			this.variantMatch = variantMatch[0]
		},
	}
})
</script>

<template>
	<Container class="bg-neurodarkgreyvar">
		<div class="grid lg:grid-cols-2 grid-cols-1 gap-10 py-10" v-if="product">
			<div>
				<nuxt-img :alt="product.title" :src="product.image.url" class="w-full" />
			</div>
			<div>
				<nuxt-link to="/shop" class="text-neurolink mb-20 mt-7 block">Back to shop</nuxt-link>
				<h2 class="text-4xl font-bold text-white">{{ product.title }}</h2>
				<h5 class="text-white font-light opacity-50 mb-20">{{ product.type }}</h5>
				<Spinner v-if="loading"></Spinner>
				<div v-if="fullyMounted">
					<div class="text-white font-light opacity-50 pb-3">Size</div>
					<span v-for="option, i in sizes.values"
					    :key="i"
						:class="selectedSize?.title === option.title ? 'border border-white bg-neuroprimary rounded border-opacity-50 px-3 py-2 mr-3' : 'border border-white rounded border-opacity-50 px-3 py-2 mr-3'">
						<button @click="selectSize(option)" class="mx-auto my-auto text-white font-bold">
							{{ option.title }}
						</button>
					</span>
				</div>
				<div class="grid grid-cols-3 gap-5 py-10">
					<div v-for="property, i in product.properties" :key="i">
						<div class="text-white font-light opacity-50">{{ property.key }}</div>
						<span class="text-white">{{ property.value }}</span>
					</div>
					<div v-if="variantMatch">
						<div class="text-red-700" v-if="!variantMatch.is_available">The selected size is currently out
							of stock.</div>
					</div>
				</div>
				<div class="grid grid-cols-3 gap-5 pt-10">
					<div class="col-span-2">
						<button @click="addToCart"
							class="w-full border border-neuroprimary bg-neuroprimary py-2 rounded text-white">
							Add to cart
						</button>
					</div>
					<div class="col-span-1" v-if="variantMatch">
						<div
							class="border text-center border-white border-opacity-20 py-2 rounded text-white font-bold">
							€{{ variantMatch.price / 100 }}
						</div>
					</div>
				</div>
				<div class="my-10 border border-b w-full border-white border-opacity-10"></div>
				<div class="grid grid-cols-2 pb-20">
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
				</div>
			</div>
		</div>
	</Container>
</template>

<style scoped></style>