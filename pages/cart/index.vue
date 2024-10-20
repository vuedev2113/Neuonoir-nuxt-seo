<script>
import Container from "~/components/layout/Container.vue";
import Section from "~/components/layout/Section.vue";
import Spinner from "~/components/misc/Spinner.vue";

export default {
	components: {Spinner, Container, Section},
	data() {
		return {
			config: useRuntimeConfig(),
			cartData: [],
			location: "",
			shippingData: null,
			loading: true,
			offers: [],
			postalShippings: [],
			variants: []
		}
	},
	async mounted() {
		if (process.client) {
			let cartData = []
			try {
				cartData = JSON.parse(localStorage.getItem("neuronoirCart"))
			} catch (e) {
				cartData = []
			}

			this.cartData = await Promise.all(cartData.map(async item => {
				if (item.product.type == 'T-Shirt') {
					let response = await fetch(this.config.public.baseURL + "/api/products/" + item.product.productId)
					let backendProduct = await response.json()

					let variant = backendProduct.variants.filter(variant => {
						if (!variant.is_enabled) {
							return false
						}

						const hasVariant = variant.options.filter(option => {
							return option == item.selectedSize.id
						})

						return hasVariant.length > 0
					})

					item.variant = variant[0]
				}

				if (item.product.type == 'T Shirt') {
					const productId = item.product.productId
					const variants = await this.getVariants(productId)
					this.variants.push(...variants)
				}

				return item
			}))

			const response = await GqlGetShippings();
			this.postalShippings = response.shippings;

			this.loading = false
		}

		this.location = await this.getLocation()
		this.shippingData = await this.getShippingData()
		this.offers = await this.getOffers()
	},
	computed: {
		subTotal() {
			let sum = 0;
			this.cartData.forEach(item => {
				if (item.product.type === 'T-Shirt') {
					sum += item.quantity * Number(item.variant.price)
				} else {
					sum += item.quantity * this.getOfferPrice(item.product.productId)
				}
			})
			return sum
		},
		shippingCost() {
			if (!this.location && !this.shippingData) {
				return 0
			}

			if (this.shippingData === null) {
				return 0
			}

			let profile = this.shippingData.profiles.filter(profile => {
				return profile.countries.filter(country => country == this.location).length > 0
			})

			if (profile.length > 1) {
				console.log("Multiple profiles found!")
			}

			profile = profile[0]

			let totalQuantity = 0
			let postalShippingItemsCount = 0
			this.cartData.forEach(item => {
				if (item.product.type === 'T-Shirt') {
					totalQuantity += item.quantity
				} else {
					postalShippingItemsCount++
				}
			})

			let firstItem = 0
			let additionalItems = 0
			if (totalQuantity >= 1) {
				firstItem = 1
			}
			additionalItems = totalQuantity - firstItem

			let printifyShippingCost = firstItem * profile.first_item.cost + additionalItems * profile.additional_items.cost
			let manualFulfilmentShippingCost = 0 //TODO:

			if (postalShippingItemsCount >= 1) {
				let postalShipping = this.postalShippings.filter(shipping => shipping.countryIso2.toUpperCase() === this.location.toUpperCase())
				manualFulfilmentShippingCost = parseInt(postalShipping[0].costEuro) * 100
			}

			return printifyShippingCost + manualFulfilmentShippingCost
		}
	},
	methods: {
		deleteFromCart(item) {
			this.cartData = this.cartData.filter(i => i.product.productId != item.product.productId)
			this.updateCart()
		},
		onQuantityUpdate() {
			this.updateCart()
		},
		updateCart() {
			localStorage.setItem('neuronoirCart', JSON.stringify(this.cartData))
		},
		getOfferPrice(productId) {
			if (this.offers.length === 0) {
				return 0
			}

			const offers = this.offers.filter(offer => {
				return offer.productId === productId
			})

			if (offers.length === 0) {
				return 0
			}

			return offers[0].price
		},
		isCustomVariantAvailable(item) {
			const productId = item.product.productId
			const size = item.selectedSize.title
			const variant = this.variants.filter(variant => variant.variant === size && variant.productId === productId)

			if (!variant.length) {
				return false
			}

			return variant[0].stock > 0;
		},
		async getLocation() {
			const response = await fetch('https://api.ipregistry.co/?key=c6yjeqjieeuzoswy')
			const payload = await response.json()
			return payload.location.country.code
		},
		async getShippingData() {
			const response = await fetch(this.config.public.baseURL + "/api/products/shipping")
			return await response.json()
		},
		async getOffers() {
			const { offers } = await GqlGetOffers();
			return offers;
		},
		async getVariants(productId) {
			const {variants} = await GqlGetVariant({
				slug: productId
			})
			return variants
		}
	}
}
</script>

<template>
	<Container class="bg-neurodarkgreyvar">
		<div class="py-10">
			<Section title="Your cart" description="Here are the products you added to your cart."/>
			<div v-if="!cartData.length && !loading">
				<span class="text-white opacity-50">You have no items in your cart.</span>
			</div>
			<Spinner v-if="loading"></Spinner>
			<div v-for="item in cartData" class="pb-10" v-if="cartData.length">
				<div data-offer-id="5" class="cart-item-wrapper flex flex-wrap border border-white border-opacity-10 rounded-lg overflow-hidden gap-x-4 sm:gap-y-4 lg:gap-6">
					<a href="#" class="group w-32 sm:w-40 h-48 sm:h-56 block overflow-hidden relative">
						<nuxt-img :alt="item.product.title" :src="item.product.image.url" loading="lazy" class="w-full h-full object-cover object-center group-hover:scale-110 transition duration-200" />
					</a>
					<div class="flex flex-col justify-between flex-1 py-4">
						<div>
							<h3 class="inline-block text-white uppercase text-lg lg:text-xl font-bold mb-1">
								{{item.product.title}}
							</h3>
							<div v-if="item.product.type === 'T-Shirt'">
								<h5 class="block text-white opacity-50">Size: {{item.selectedSize.title}}</h5>
								<span v-if="!item.variant.is_available" class="block text-red-600 mb-1">This size is currently out of stock.</span>
							</div>
							<div v-if="item.product.type === 'T Shirt'">
								<h6 class="block text-white opacity-50">Size: {{item.selectedSize.title}}</h6>
								<span v-if="!isCustomVariantAvailable(item)" class="block text-red-600 mb-1">This size is currently out of stock.</span>
							</div>
						</div>
						<div v-if="item.variant && item.product.type === 'T-Shirt'">
							<span class="block text-white md:text-lg font-bold mb-1">€{{(item.variant.price / 100).toFixed(2)}}</span>
						</div>
						<div v-if="item.product.type !== 'T-Shirt'">
							<span class="block text-white md:text-lg font-bold mb-1">€{{(getOfferPrice(item.product.productId) / 100).toFixed(2)}}</span>
						</div>
					</div>
					<div class="w-full sm:w-auto flex justify-between border-t sm:border-none p-4 sm:pl-0 lg:p-6 lg:pl-0">
						<div class="flex flex-col items-start gap-2">
							<div class="w-20 h-12 flex border rounded overflow-hidden">
								<input v-on:change="onQuantityUpdate" min="1" type="number" v-model="item.quantity" class="item-qty text-neurodarkgrey w-full focus:ring ring-inset ring-neuroprimary outline-none transition duration-100 px-4 py-2">
							</div>
							<button @click="deleteFromCart(item)" class="delete-from-cart text-neurolink text-sm font-semibold select-none transition duration-100">
								Delete
							</button>
						</div>
						<div class="pt-3 md:pt-2 ml-4 md:ml-8 lg:ml-16" v-if="item.product.type === 'T-Shirt'">
							<span class="block text-zinc-100 md:text-lg font-bold">€{{((item.variant.price / 100) * item.quantity).toFixed(2)}}</span>
						</div>
						<div class="pt-3 md:pt-2 ml-4 md:ml-8 lg:ml-16" v-if="item.product.type !== 'T-Shirt'">
							<span class="block text-zinc-100 md:text-lg font-bold">€{{((getOfferPrice(item.product.productId) / 100) * item.quantity).toFixed(2)}}</span>
						</div>
					</div>
				</div>
			</div>
			<div class="float-right pb-10">
				<div class="bg-neurodarkgrey rounded px-3 py-3">
					<div class="flex justify-between">
						<span class="text-white opacity-50 pr-10">Subtotal</span>
						<span class="text-white opacity-50">€{{(subTotal / 100).toFixed(2)}}</span>
					</div>
					<div class="flex justify-between">
						<span class="text-white opacity-50 pr-10">Shipping in {{location}}</span>
						<span class="text-white opacity-50">€{{(shippingCost / 100).toFixed(2)}}</span>
					</div>
					<hr class="block my-5 opacity-10"/>
					<div class="flex justify-between">
						<span class="text-white font-bold pr-10">Total</span>
						<span class="text-white font-bold ">€{{((subTotal + shippingCost) / 100).toFixed(2)}}</span>
					</div>
					<nuxt-link to="/checkout" class="bg-neuroprimary font-light px-6 py-2 text-white rounded w-full block text-center mt-5">
						Checkout
					</nuxt-link>
				</div>
			</div>
		</div>
	</Container>
</template>
